<?php
/**
 * UIU Project Showcase & Archive System
 * API Endpoint: Add New Project Dynamically
 * 
 * Target Environment: XAMPP Localhost
 * Safe PDO Implementation with Prepared Statements & Transaction Handling
 */

require_once __DIR__ . '/../config/db.php';

// Handle CORS Pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJsonResponse(['status' => 'ok']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse([
        'success' => false,
        'message' => 'Invalid request method. Only POST is accepted for project submission.'
    ], 405);
}

try {
    $pdo = getDBConnection();

    // Parse input (supports JSON payload or URL-encoded form data)
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        $input = $_POST;
    }

    $title        = isset($input['title']) ? trim($input['title']) : '';
    $courseId     = isset($input['course_id']) && is_numeric($input['course_id']) ? (int)$input['course_id'] : 0;
    $trimesterId  = isset($input['trimester_id']) && is_numeric($input['trimester_id']) ? (int)$input['trimester_id'] : 0;
    $abstract     = isset($input['abstract']) ? trim($input['abstract']) : '';
    $techStack    = isset($input['tech_stack']) ? trim($input['tech_stack']) : '';
    $githubUrl    = isset($input['github_url']) && !empty(trim($input['github_url'])) ? trim($input['github_url']) : null;
    $demoUrl      = isset($input['demo_url']) && !empty(trim($input['demo_url'])) ? trim($input['demo_url']) : null;
    $leaderName   = isset($input['leader_name']) ? trim($input['leader_name']) : '';
    $leaderId     = isset($input['leader_id']) ? trim($input['leader_id']) : '';
    $supervisorId = isset($input['supervisor_id']) && is_numeric($input['supervisor_id']) ? (int)$input['supervisor_id'] : null;
    $awardTitle   = isset($input['award_title']) ? trim($input['award_title']) : 'None';
    $prizeMoney   = isset($input['prize_money']) && is_numeric($input['prize_money']) ? (float)$input['prize_money'] : 0.00;

    // Strict Validations
    if (empty($title) || strlen($title) < 3) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Validation Error: Project title must be at least 3 characters long.'
        ], 422);
    }

    if ($courseId <= 0) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Validation Error: Please select a valid course.'
        ], 422);
    }

    if ($trimesterId <= 0) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Validation Error: Please select a valid trimester.'
        ], 422);
    }

    if (empty($abstract) || strlen($abstract) < 10) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Validation Error: Project abstract must be at least 10 characters long.'
        ], 422);
    }

    if (empty($techStack)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Validation Error: Please enter tech stack keywords (e.g. "React, Node.js, MySQL").'
        ], 422);
    }

    if (empty($leaderName) || empty($leaderId)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Validation Error: Team leader full name and student ID are required.'
        ], 422);
    }

    // Begin Transaction
    $pdo->beginTransaction();

    // 1. Resolve or Insert Leader User
    $userStmt = $pdo->prepare("SELECT user_id FROM users WHERE student_or_faculty_id = :sid");
    $userStmt->execute([':sid' => $leaderId]);
    $existingUser = $userStmt->fetch();

    if ($existingUser) {
        $leaderUserId = (int)$existingUser['user_id'];
    } else {
        $cleanEmail = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $leaderId)) . '@bscse.uiu.ac.bd';
        $insertUserStmt = $pdo->prepare("
            INSERT INTO users (student_or_faculty_id, full_name, email, role, password_hash, dept_id)
            VALUES (:sid, :name, :email, 'student', '$2y$10$wE96X1vQz76RkKxO2x6Lzuxl6M2m8v6BskjQyZ3d4y2m4f7H5r6X2', 1)
        ");
        $insertUserStmt->execute([
            ':sid'   => $leaderId,
            ':name'  => $leaderName,
            ':email' => $cleanEmail
        ]);
        $leaderUserId = (int)$pdo->lastInsertId();
    }

    // 2. Insert Project (Trigger 4 trg_audit_project_created will automatically fire here)
    $projectStmt = $pdo->prepare("
        INSERT INTO projects (course_id, trimester_id, title, abstract, tech_stack, github_url, demo_url, submission_date, created_by, supervisor_id, status)
        VALUES (:cid, :tid, :title, :abstract, :tech, :github, :demo, CURDATE(), :created_by, :sup_id, 'Approved')
    ");
    $projectStmt->execute([
        ':cid'        => $courseId,
        ':tid'        => $trimesterId,
        ':title'      => $title,
        ':abstract'   => $abstract,
        ':tech'       => $techStack,
        ':github'     => $githubUrl,
        ':demo'       => $demoUrl,
        ':created_by' => $leaderUserId,
        ':sup_id'     => $supervisorId
    ]);
    $newProjectId = (int)$pdo->lastInsertId();

    // 3. Insert Team Leader in project_members (Trigger 2 trg_enforce_team_size_limit verifies count <= 4)
    $memberStmt = $pdo->prepare("
        INSERT INTO project_members (project_id, user_id, role_in_team, contribution_details)
        VALUES (:pid, :uid, 'Leader', 'Lead architect and primary project developer')
    ");
    $memberStmt->execute([
        ':pid' => $newProjectId,
        ':uid' => $leaderUserId
    ]);

    // 4. If Award is selected, map to showcase event and insert award
    if ($awardTitle !== 'None' && !empty($awardTitle)) {
        // Find showcase event matching course and trimester, or fallback to nearest
        $eventStmt = $pdo->prepare("SELECT event_id FROM showcase_events WHERE course_id = :cid AND trimester_id = :tid LIMIT 1");
        $eventStmt->execute([':cid' => $courseId, ':tid' => $trimesterId]);
        $event = $eventStmt->fetch();

        $eventId = $event ? (int)$event['event_id'] : 1;

        $awardStmt = $pdo->prepare("
            INSERT INTO awards (project_id, event_id, award_title, prize_money, remarks)
            VALUES (:pid, :eid, :atitle, :money, :remarks)
        ");
        $awardStmt->execute([
            ':pid'     => $newProjectId,
            ':eid'     => $eventId,
            ':atitle'  => $awardTitle,
            ':money'   => $prizeMoney,
            ':remarks' => "Conferred $awardTitle distinction at UIU Project Showcase."
        ]);
    }

    $pdo->commit();

    sendJsonResponse([
        'success'    => true,
        'message'    => "Project \"$title\" has been registered and archived successfully!",
        'project_id' => $newProjectId
    ], 201);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ], 500);
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendJsonResponse([
        'success' => false,
        'message' => 'Failed to add project: ' . $e->getMessage()
    ], 500);
}
