<?php
/**
 * UIU Project Showcase & Archive System
 * API Endpoint: Fetch Detailed Single Project with Members, Supervisor, Award & Audit Trail
 * 
 * Target Environment: XAMPP Localhost
 * Safe PDO Implementation with Prepared Statements
 */

require_once __DIR__ . '/../config/db.php';

// Handle CORS Pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJsonResponse(['status' => 'ok']);
}

$projectId = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : 0;

if ($projectId <= 0) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Invalid or missing project ID parameter.'
    ], 400);
}

try {
    $pdo = getDBConnection();

    // 1. Fetch Core Project Details
    $sql = "
        SELECT 
            p.project_id,
            p.title,
            p.abstract,
            p.tech_stack,
            p.github_url,
            p.demo_url,
            p.submission_date,
            p.status,
            p.created_at,
            p.updated_at,
            c.course_id,
            c.course_code,
            c.course_title,
            d.dept_code,
            d.dept_name,
            t.trimester_id,
            t.trimester_code,
            t.term_name,
            t.year,
            CONCAT(t.term_name, ' ', t.year) AS academic_session,
            u_sup.user_id AS supervisor_id,
            u_sup.full_name AS supervisor_name,
            u_sup.email AS supervisor_email,
            u_sup.student_or_faculty_id AS supervisor_code,
            u_cr.full_name AS creator_name,
            u_cr.student_or_faculty_id AS creator_student_id,
            a.award_id,
            a.award_title,
            a.prize_money,
            a.remarks AS award_remarks,
            a.awarded_at,
            se.event_id,
            se.event_title,
            se.event_date,
            se.venue
        FROM projects p
        INNER JOIN courses c ON p.course_id = c.course_id
        INNER JOIN departments d ON c.dept_id = d.dept_id
        INNER JOIN trimesters t ON p.trimester_id = t.trimester_id
        LEFT JOIN users u_sup ON p.supervisor_id = u_sup.user_id
        LEFT JOIN users u_cr ON p.created_by = u_cr.user_id
        LEFT JOIN awards a ON p.project_id = a.project_id
        LEFT JOIN showcase_events se ON a.event_id = se.event_id
        WHERE p.project_id = :project_id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':project_id' => $projectId]);
    $project = $stmt->fetch();

    if (!$project) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Project with ID ' . $projectId . ' was not found in the university archives.'
        ], 404);
    }

    // 2. Fetch Team Members
    $membersStmt = $pdo->prepare("
        SELECT 
            pm.member_id,
            pm.role_in_team,
            pm.contribution_details,
            pm.joined_at,
            u.user_id,
            u.student_or_faculty_id,
            u.full_name,
            u.email,
            d.dept_code
        FROM project_members pm
        INNER JOIN users u ON pm.user_id = u.user_id
        LEFT JOIN departments d ON u.dept_id = d.dept_id
        WHERE pm.project_id = :project_id
        ORDER BY pm.role_in_team DESC, u.student_or_faculty_id ASC
    ");
    $membersStmt->execute([':project_id' => $projectId]);
    $members = $membersStmt->fetchAll();

    // 3. Fetch Project Audit Log History
    $auditStmt = $pdo->prepare("
        SELECT 
            pal.log_id,
            pal.action_type,
            pal.timestamp,
            pal.details,
            u.full_name AS performed_by_name,
            u.role AS performed_by_role
        FROM project_audit_log pal
        LEFT JOIN users u ON pal.performed_by = u.user_id
        WHERE pal.project_id = :project_id
        ORDER BY pal.timestamp DESC, pal.log_id DESC
        LIMIT 10
    ");
    $auditStmt->execute([':project_id' => $projectId]);
    $auditLogs = $auditStmt->fetchAll();

    // 4. Tech stack array
    $techTags = array_map('trim', explode(',', $project['tech_stack']));

    // 5. Structure payload
    $response = [
        'success' => true,
        'project' => [
            'project_id'      => (int)$project['project_id'],
            'title'           => $project['title'],
            'abstract'        => $project['abstract'],
            'tech_stack'      => $project['tech_stack'],
            'tech_tags'       => $techTags,
            'github_url'      => $project['github_url'],
            'demo_url'        => $project['demo_url'],
            'submission_date' => $project['submission_date'],
            'status'          => $project['status'],
            'created_at'      => $project['created_at'],
            'updated_at'      => $project['updated_at'],
            'course' => [
                'course_id'    => (int)$project['course_id'],
                'course_code'  => $project['course_code'],
                'course_title' => $project['course_title'],
                'dept_code'    => $project['dept_code'],
                'dept_name'    => $project['dept_name']
            ],
            'trimester' => [
                'trimester_id'   => (int)$project['trimester_id'],
                'trimester_code' => $project['trimester_code'],
                'term_name'      => $project['term_name'],
                'year'           => (int)$project['year'],
                'session'        => $project['academic_session']
            ],
            'supervisor' => $project['supervisor_name'] ? [
                'name'  => $project['supervisor_name'],
                'email' => $project['supervisor_email'],
                'code'  => $project['supervisor_code']
            ] : null,
            'award' => $project['award_id'] ? [
                'award_id'    => (int)$project['award_id'],
                'award_title' => $project['award_title'],
                'prize_money' => (float)$project['prize_money'],
                'remarks'     => $project['award_remarks'],
                'awarded_at'  => $project['awarded_at'],
                'event_title' => $project['event_title'],
                'event_date'  => $project['event_date'],
                'venue'       => $project['venue']
            ] : null,
            'members'   => array_map(function($m) {
                return [
                    'member_id'    => (int)$m['member_id'],
                    'user_id'      => (int)$m['user_id'],
                    'student_id'   => $m['student_or_faculty_id'],
                    'name'         => $m['full_name'],
                    'email'        => $m['email'],
                    'role'         => $m['role_in_team'],
                    'dept'         => $m['dept_code'],
                    'contribution' => $m['contribution_details']
                ];
            }, $members),
            'audit_trail' => $auditLogs
        ]
    ];

    sendJsonResponse($response);

} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Error retrieving project details: ' . $e->getMessage()
    ], 500);
}
