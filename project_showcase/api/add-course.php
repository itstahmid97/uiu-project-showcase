<?php
/**
 * UIU Project Showcase & Archive System
 * API Endpoint: Add New Course Dynamically (Extensibility Requirement)
 * 
 * Target Environment: XAMPP Localhost
 * Safe PDO Implementation with Prepared Statements
 */

require_once __DIR__ . '/../config/db.php';

// Handle CORS Pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJsonResponse(['status' => 'ok']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse([
        'success' => false,
        'message' => 'Invalid request method. Only POST is accepted for course creation.'
    ], 405);
}

try {
    $pdo = getDBConnection();

    // Parse input (supports JSON payload or URL-encoded form data)
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        $input = $_POST;
    }

    $courseCode  = isset($input['course_code']) ? trim($input['course_code']) : '';
    $courseTitle = isset($input['course_title']) ? trim($input['course_title']) : '';
    $deptId      = isset($input['dept_id']) && is_numeric($input['dept_id']) ? (int)$input['dept_id'] : 1; // Default CSE dept

    // Validation
    if (empty($courseCode) || strlen($courseCode) < 3) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Validation Error: Course code is required (e.g., "CSE 4182").'
        ], 422);
    }

    if (empty($courseTitle) || strlen($courseTitle) < 4) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Validation Error: Course title must be at least 4 characters long.'
        ], 422);
    }

    // Check if Department exists
    $deptCheck = $pdo->prepare("SELECT dept_id, dept_code FROM departments WHERE dept_id = :dept_id");
    $deptCheck->execute([':dept_id' => $deptId]);
    $dept = $deptCheck->fetch();

    if (!$dept) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid Department ID selected.'
        ], 422);
    }

    // Check if Course Code already exists
    $codeCheck = $pdo->prepare("SELECT course_id, course_code, course_title FROM courses WHERE course_code = :code");
    $codeCheck->execute([':code' => $courseCode]);
    $existing = $codeCheck->fetch();

    if ($existing) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Course code "' . htmlspecialchars($courseCode) . '" already exists as "' . htmlspecialchars($existing['course_title']) . '".'
        ], 409);
    }

    // Insert new course using prepared statement
    $insertStmt = $pdo->prepare("
        INSERT INTO courses (course_code, course_title, dept_id, is_active)
        VALUES (:code, :title, :dept_id, 1)
    ");
    $insertStmt->execute([
        ':code'    => $courseCode,
        ':title'   => $courseTitle,
        ':dept_id' => $deptId
    ]);

    $newCourseId = (int)$pdo->lastInsertId();

    // Log the creation into audit trail
    $auditStmt = $pdo->prepare("
        INSERT INTO project_audit_log (action_type, performed_by, details)
        VALUES ('COURSE_CREATED', 6, :details)
    ");
    $auditStmt->execute([
        ':details' => "Administrative creation of course '$courseCode: $courseTitle' (Dept: {$dept['dept_code']})."
    ]);

    // Return the newly created course object and fresh list of all courses
    $allCoursesStmt = $pdo->query("
        SELECT c.course_id, c.course_code, c.course_title, d.dept_code,
               (SELECT COUNT(*) FROM projects p WHERE p.course_id = c.course_id) AS project_count
        FROM courses c 
        INNER JOIN departments d ON c.dept_id = d.dept_id
        WHERE c.is_active = 1
        ORDER BY c.course_code ASC
    ");
    $updatedCourses = $allCoursesStmt->fetchAll();

    sendJsonResponse([
        'success' => true,
        'message' => "Course \"$courseCode - $courseTitle\" added successfully!",
        'course'  => [
            'course_id'    => $newCourseId,
            'course_code'  => $courseCode,
            'course_title' => $courseTitle,
            'dept_code'    => $dept['dept_code']
        ],
        'courses' => $updatedCourses
    ], 201);

} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Failed to add course: ' . $e->getMessage()
    ], 500);
}
