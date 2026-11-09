<?php
/**
 * UIU Project Showcase & Archive System
 * API Endpoint: 12 Mandatory SQL Queries Runner & Viva Explorer
 * 
 * Target Environment: XAMPP Localhost
 * Safe Execution of Curated Educational & Demonstration Queries
 */

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJsonResponse(['status' => 'ok']);
}

// 12 Curated Mandatory SQL Queries for CSE 3522 Lab Evaluation
$catalog = [
    1 => [
        'id' => 1,
        'category' => 'Complex Join (5 Tables)',
        'title' => 'Winning Projects with Award & Leader Info',
        'description' => 'INNER JOIN across 5 tables (projects, courses, trimesters, awards, showcase_events, users) to display champion projects, prize money, and leaders.',
        'sql' => "SELECT p.project_id, p.title AS project_title, c.course_code, CONCAT(t.term_name, ' ', t.year) AS trimester, a.award_title, a.prize_money, se.event_title, se.venue, u.full_name AS team_leader_name, u.student_or_faculty_id AS student_id FROM projects p INNER JOIN courses c ON p.course_id = c.course_id INNER JOIN trimesters t ON p.trimester_id = t.trimester_id INNER JOIN awards a ON p.project_id = a.project_id INNER JOIN showcase_events se ON a.event_id = se.event_id INNER JOIN project_members pm ON p.project_id = pm.project_id AND pm.role_in_team = 'Leader' INNER JOIN users u ON pm.user_id = u.user_id ORDER BY a.prize_money DESC, se.event_date DESC;"
    ],
    2 => [
        'id' => 2,
        'category' => 'Complex Join (LEFT JOIN)',
        'title' => 'All Projects with Award Status (Won or Unawarded)',
        'description' => 'LEFT JOIN across 6 tables to capture all projects regardless of whether they received an award or not.',
        'sql' => "SELECT p.project_id, p.title AS project_title, c.course_code, d.dept_code, CONCAT(t.term_name, ' ', t.year) AS session_name, u_leader.full_name AS team_leader, COALESCE(u_sup.full_name, 'Unassigned') AS faculty_supervisor, COALESCE(a.award_title, 'No Award Won') AS award_distinction, COALESCE(a.prize_money, 0.00) AS prize_money_awarded FROM projects p INNER JOIN courses c ON p.course_id = c.course_id INNER JOIN departments d ON c.dept_id = d.dept_id INNER JOIN trimesters t ON p.trimester_id = t.trimester_id INNER JOIN project_members pm ON p.project_id = pm.project_id AND pm.role_in_team = 'Leader' INNER JOIN users u_leader ON pm.user_id = u_leader.user_id LEFT JOIN users u_sup ON p.supervisor_id = u_sup.user_id LEFT JOIN awards a ON p.project_id = a.project_id ORDER BY p.course_id ASC, prize_money_awarded DESC, p.submission_date DESC;"
    ],
    3 => [
        'id' => 3,
        'category' => 'Complex Join with Member Aggregation',
        'title' => 'Project Roster with Team Count & Event Status',
        'description' => 'Aggregates team member count and full team roster names per project using GROUP_CONCAT.',
        'sql' => "SELECT p.project_id, p.title AS project_title, c.course_code, u_sup.full_name AS supervisor_name, COUNT(pm.member_id) AS total_team_members, GROUP_CONCAT(u_mem.full_name ORDER BY pm.role_in_team DESC, u_mem.full_name ASC SEPARATOR ', ') AS team_roster, COALESCE(se.event_title, 'Not Showcased Yet') AS showcase_event FROM projects p INNER JOIN courses c ON p.course_id = c.course_id LEFT JOIN users u_sup ON p.supervisor_id = u_sup.user_id INNER JOIN project_members pm ON p.project_id = pm.project_id INNER JOIN users u_mem ON pm.user_id = u_mem.user_id LEFT JOIN awards a ON p.project_id = a.project_id LEFT JOIN showcase_events se ON a.event_id = se.event_id GROUP BY p.project_id, p.title, c.course_code, u_sup.full_name, se.event_title ORDER BY total_team_members DESC, p.project_id ASC;"
    ],
    4 => [
        'id' => 4,
        'category' => 'Subquery (Correlated)',
        'title' => 'Projects with Above-Average Team Size',
        'description' => 'Uses a correlated subquery to dynamically filter projects whose team member count exceeds the university overall average team size.',
        'sql' => "SELECT p.project_id, p.title AS project_title, c.course_code, (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.project_id) AS team_size FROM projects p INNER JOIN courses c ON p.course_id = c.course_id WHERE (SELECT COUNT(*) FROM project_members pm1 WHERE pm1.project_id = p.project_id) > (SELECT AVG(member_count) FROM (SELECT COUNT(*) AS member_count FROM project_members GROUP BY project_id) AS avg_calc) ORDER BY team_size DESC;"
    ],
    5 => [
        'id' => 5,
        'category' => 'Subquery (IN Operator)',
        'title' => 'Faculty Mentoring High-Value Award Winners (>=10,000 BDT)',
        'description' => 'Finds faculty who supervised top projects winning BDT 10,000 or more using an IN subquery.',
        'sql' => "SELECT u.user_id, u.student_or_faculty_id AS faculty_code, u.full_name AS faculty_name, u.email FROM users u WHERE u.role = 'faculty' AND u.user_id IN (SELECT DISTINCT p.supervisor_id FROM projects p INNER JOIN awards a ON p.project_id = a.project_id WHERE a.prize_money >= 10000.00 AND p.supervisor_id IS NOT NULL) ORDER BY u.full_name ASC;"
    ],
    6 => [
        'id' => 6,
        'category' => 'Subquery (EXISTS Operator)',
        'title' => 'Courses Producing 1st Prize or Best FYDP Champions',
        'description' => 'Evaluates course records using EXISTS to verify the presence of top distinction winners.',
        'sql' => "SELECT c.course_id, c.course_code, c.course_title FROM courses c WHERE EXISTS (SELECT 1 FROM projects p INNER JOIN awards a ON p.project_id = a.project_id WHERE p.course_id = c.course_id AND a.award_title IN ('1st Prize', 'Best FYDP')) ORDER BY c.course_code ASC;"
    ],
    7 => [
        'id' => 7,
        'category' => 'Aggregation (GROUP BY & HAVING)',
        'title' => 'Courses with >=3 Projects & Award Statistics',
        'description' => 'Uses GROUP BY and HAVING project_count >= 3 with COUNT, AVG, and MAX aggregate functions.',
        'sql' => "SELECT c.course_code, c.course_title, COUNT(DISTINCT p.project_id) AS project_count, COUNT(DISTINCT a.award_id) AS total_awards_won, ROUND(AVG(COALESCE(a.prize_money, 0)), 2) AS avg_prize_money, MAX(COALESCE(a.prize_money, 0)) AS max_prize_money FROM courses c INNER JOIN projects p ON c.course_id = p.course_id LEFT JOIN awards a ON p.project_id = a.project_id GROUP BY c.course_id, c.course_code, c.course_title HAVING project_count >= 3 ORDER BY total_awards_won DESC, project_count DESC;"
    ],
    8 => [
        'id' => 8,
        'category' => 'Aggregation (GROUP BY & HAVING)',
        'title' => 'Supervisors with Cumulative Prize Funding >= 20,000 BDT',
        'description' => 'Calculates faculty mentoring impact using SUM(prize_money) with HAVING total_prize >= 20000.',
        'sql' => "SELECT u.user_id AS supervisor_id, u.full_name AS supervisor_name, u.email, COUNT(DISTINCT p.project_id) AS total_projects_supervised, COUNT(DISTINCT a.award_id) AS total_awarded_projects, SUM(a.prize_money) AS total_prize_accumulated FROM users u INNER JOIN projects p ON u.user_id = p.supervisor_id INNER JOIN awards a ON p.project_id = a.project_id WHERE u.role = 'faculty' GROUP BY u.user_id, u.full_name, u.email HAVING total_prize_accumulated >= 20000.00 ORDER BY total_prize_accumulated DESC;"
    ],
    9 => [
        'id' => 9,
        'category' => 'Aggregation & Trimester Grouping',
        'title' => 'Trimester Participation & Funding Metrics',
        'description' => 'Analyzes projects, active student participants, and total prize money across trimesters.',
        'sql' => "SELECT t.trimester_code, CONCAT(t.term_name, ' ', t.year) AS academic_term, COUNT(DISTINCT p.project_id) AS total_submitted_projects, COUNT(DISTINCT pm.user_id) AS total_active_students, COALESCE(SUM(a.prize_money), 0.00) AS total_prize_distributed, ROUND(AVG(COALESCE(a.prize_money, 0)), 2) AS average_prize_per_project FROM trimesters t LEFT JOIN projects p ON t.trimester_id = p.trimester_id LEFT JOIN project_members pm ON p.project_id = pm.project_id LEFT JOIN awards a ON p.project_id = a.project_id GROUP BY t.trimester_id, t.trimester_code, t.term_name, t.year ORDER BY t.year DESC, t.term_name ASC;"
    ],
    10 => [
        'id' => 10,
        'category' => 'Sorting & Ordering (Multi-Column)',
        'title' => 'Prize Money Ranking with Submission Tie-Breaker',
        'description' => 'Multi-column ORDER BY sorting descending by prize money and ascending by submission date.',
        'sql' => "SELECT a.award_title, a.prize_money, p.title AS project_title, c.course_code, p.submission_date, se.event_title FROM awards a INNER JOIN projects p ON a.project_id = p.project_id INNER JOIN courses c ON p.course_id = c.course_id INNER JOIN showcase_events se ON a.event_id = se.event_id ORDER BY a.prize_money DESC, p.submission_date ASC;"
    ],
    11 => [
        'id' => 11,
        'category' => 'Sorting & Ordering (Audit Trail)',
        'title' => 'Latest 15 System Security & Audit Events',
        'description' => 'Chronological trace of project lifecycle events ordered by timestamp DESC.',
        'sql' => "SELECT pal.log_id, pal.action_type, COALESCE(p.title, 'System Level Event') AS referenced_project, COALESCE(u.full_name, 'System Daemon') AS performed_by_user, pal.timestamp AS event_time, pal.details FROM project_audit_log pal LEFT JOIN projects p ON pal.project_id = p.project_id LEFT JOIN users u ON pal.performed_by = u.user_id ORDER BY pal.timestamp DESC, pal.log_id DESC LIMIT 15;"
    ],
    12 => [
        'id' => 12,
        'category' => 'Sorting & Ordering (Student Roster)',
        'title' => 'Student Participant Roster by Course & Role',
        'description' => 'Sorts directory by course code ASC, title ASC, team role DESC (Leader before Member), and student ID ASC.',
        'sql' => "SELECT c.course_code, p.title AS project_title, pm.role_in_team, u.student_or_faculty_id AS student_id, u.full_name AS student_name, u.email AS university_email FROM project_members pm INNER JOIN projects p ON pm.project_id = p.project_id INNER JOIN courses c ON p.course_id = c.course_id INNER JOIN users u ON pm.user_id = u.user_id ORDER BY c.course_code ASC, p.title ASC, pm.role_in_team DESC, u.student_or_faculty_id ASC LIMIT 25;"
    ]
];

$queryId = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : null;

if ($queryId === null) {
    // Return list of all available queries
    sendJsonResponse([
        'success' => true,
        'catalog' => array_values($catalog)
    ]);
}

if (!isset($catalog[$queryId])) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Query ID not found in laboratory catalog.'
    ], 404);
}

try {
    $pdo = getDBConnection();
    $target = $catalog[$queryId];
    
    $startTime = microtime(true);
    $stmt = $pdo->query($target['sql']);
    $rows = $stmt->fetchAll();
    $executionTime = round((microtime(true) - $startTime) * 1000, 2); // In milliseconds

    // Extract column headers
    $columns = !empty($rows) ? array_keys($rows[0]) : [];

    sendJsonResponse([
        'success'        => true,
        'meta'           => $target,
        'execution_ms'   => $executionTime,
        'row_count'      => count($rows),
        'columns'        => $columns,
        'rows'           => $rows
    ]);

} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Query execution failed: ' . $e->getMessage()
    ], 500);
}
