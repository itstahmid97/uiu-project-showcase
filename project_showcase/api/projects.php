<?php
/**
 * UIU Project Showcase & Archive System
 * API Endpoint: Fetch Projects with Dynamic Filtering & Metadata
 * 
 * Target Environment: XAMPP Localhost
 * Safe PDO Implementation with Prepared Statements
 */

require_once __DIR__ . '/../config/db.php';

// Handle CORS Pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJsonResponse(['status' => 'ok']);
}

try {
    $pdo = getDBConnection();

    // 1. Parse and sanitize input filters
    $courseId    = isset($_GET['course_id']) && is_numeric($_GET['course_id']) ? (int)$_GET['course_id'] : null;
    $trimesterId = isset($_GET['trimester_id']) && is_numeric($_GET['trimester_id']) ? (int)$_GET['trimester_id'] : null;
    $awardFilter = isset($_GET['award']) ? trim($_GET['award']) : 'all';
    $techFilter  = isset($_GET['tech']) ? trim($_GET['tech']) : '';
    $searchQuery = isset($_GET['search']) ? trim($_GET['search']) : '';
    $sortBy      = isset($_GET['sort']) ? trim($_GET['sort']) : 'newest';

    // 2. Build Dynamic Query with Prepared Statements
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
            c.course_id,
            c.course_code,
            c.course_title,
            d.dept_code,
            t.trimester_id,
            t.trimester_code,
            t.term_name,
            t.year,
            CONCAT(t.term_name, ' ', t.year) AS academic_session,
            u_sup.full_name AS supervisor_name,
            u_sup.email AS supervisor_email,
            a.award_id,
            a.award_title,
            a.prize_money,
            a.remarks AS award_remarks,
            se.event_title,
            se.event_date
        FROM projects p
        INNER JOIN courses c ON p.course_id = c.course_id
        INNER JOIN departments d ON c.dept_id = d.dept_id
        INNER JOIN trimesters t ON p.trimester_id = t.trimester_id
        LEFT JOIN users u_sup ON p.supervisor_id = u_sup.user_id
        LEFT JOIN awards a ON p.project_id = a.project_id
        LEFT JOIN showcase_events se ON a.event_id = se.event_id
        WHERE 1 = 1
    ";

    $params = [];

    // Filter by Course
    if ($courseId !== null && $courseId > 0) {
        $sql .= " AND p.course_id = :course_id";
        $params[':course_id'] = $courseId;
    }

    // Filter by Trimester
    if ($trimesterId !== null && $trimesterId > 0) {
        $sql .= " AND p.trimester_id = :trimester_id";
        $params[':trimester_id'] = $trimesterId;
    }

    // Filter by Award
    if ($awardFilter === 'winners_only') {
        $sql .= " AND a.award_id IS NOT NULL";
    } elseif ($awardFilter === '1st_prize') {
        $sql .= " AND a.award_title = '1st Prize'";
    } elseif ($awardFilter === '2nd_prize') {
        $sql .= " AND a.award_title = '2nd Prize'";
    } elseif ($awardFilter === '3rd_prize') {
        $sql .= " AND a.award_title = '3rd Prize'";
    } elseif ($awardFilter === 'best_fydp') {
        $sql .= " AND a.award_title = 'Best FYDP'";
    } elseif ($awardFilter === 'best_innovation') {
        $sql .= " AND a.award_title = 'Best Innovation'";
    }

    // Filter by Tech Stack Keyword
    if (!empty($techFilter)) {
        $sql .= " AND p.tech_stack LIKE :tech";
        $params[':tech'] = '%' . $techFilter . '%';
    }

    // Search query on title, abstract, tech_stack, or member names
    if (!empty($searchQuery)) {
        $sql .= " AND (
            p.title LIKE :search_title 
            OR p.abstract LIKE :search_abstract 
            OR p.tech_stack LIKE :search_tech
            OR EXISTS (
                SELECT 1 FROM project_members pm_s 
                INNER JOIN users u_s ON pm_s.user_id = u_s.user_id 
                WHERE pm_s.project_id = p.project_id 
                  AND (u_s.full_name LIKE :search_member OR u_s.student_or_faculty_id LIKE :search_member_id)
            )
        )";
        $searchParam = '%' . $searchQuery . '%';
        $params[':search_title'] = $searchParam;
        $params[':search_abstract'] = $searchParam;
        $params[':search_tech'] = $searchParam;
        $params[':search_member'] = $searchParam;
        $params[':search_member_id'] = $searchParam;
    }

    // Sorting Logic
    switch ($sortBy) {
        case 'oldest':
            $sql .= " ORDER BY p.submission_date ASC, p.project_id ASC";
            break;
        case 'prize_desc':
            $sql .= " ORDER BY COALESCE(a.prize_money, 0) DESC, p.submission_date DESC";
            break;
        case 'title_asc':
            $sql .= " ORDER BY p.title ASC";
            break;
        case 'newest':
        default:
            $sql .= " ORDER BY (a.award_id IS NOT NULL) DESC, p.submission_date DESC, p.project_id DESC";
            break;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rawProjects = $stmt->fetchAll();

    // 3. Attach Team Members for each retrieved project
    $projects = [];
    if (!empty($rawProjects)) {
        $projectIds = array_column($rawProjects, 'project_id');
        
        // Prepare member lookup
        $placeholders = implode(',', array_fill(0, count($projectIds), '?'));
        $membersSql = "
            SELECT 
                pm.project_id,
                pm.role_in_team,
                pm.contribution_details,
                u.user_id,
                u.student_or_faculty_id,
                u.full_name,
                u.email
            FROM project_members pm
            INNER JOIN users u ON pm.user_id = u.user_id
            WHERE pm.project_id IN ($placeholders)
            ORDER BY pm.role_in_team DESC, u.student_or_faculty_id ASC
        ";
        $membersStmt = $pdo->prepare($membersSql);
        $membersStmt->execute($projectIds);
        $allMembers = $membersStmt->fetchAll();

        // Group members by project_id
        $membersByProject = [];
        foreach ($allMembers as $m) {
            $membersByProject[$m['project_id']][] = [
                'user_id' => (int)$m['user_id'],
                'student_id' => $m['student_or_faculty_id'],
                'full_name' => $m['full_name'],
                'role' => $m['role_in_team'],
                'contribution' => $m['contribution_details']
            ];
        }

        // Format output projects
        foreach ($rawProjects as $p) {
            $pid = (int)$p['project_id'];
            $teamMembers = $membersByProject[$pid] ?? [];
            
            // Extract leader
            $leaderName = 'N/A';
            $leaderId = 'N/A';
            foreach ($teamMembers as $tm) {
                if ($tm['role'] === 'Leader') {
                    $leaderName = $tm['full_name'];
                    $leaderId = $tm['student_id'];
                    break;
                }
            }
            if ($leaderName === 'N/A' && !empty($teamMembers)) {
                $leaderName = $teamMembers[0]['full_name'];
                $leaderId = $teamMembers[0]['student_id'];
            }

            // Tech stack tags as array
            $techTags = array_map('trim', explode(',', $p['tech_stack']));

            $projects[] = [
                'project_id'       => $pid,
                'title'            => $p['title'],
                'abstract'         => $p['abstract'],
                'tech_stack'       => $p['tech_stack'],
                'tech_tags'        => $techTags,
                'github_url'       => $p['github_url'],
                'demo_url'         => $p['demo_url'],
                'submission_date'  => $p['submission_date'],
                'status'           => $p['status'],
                'course'           => [
                    'course_id'    => (int)$p['course_id'],
                    'course_code'  => $p['course_code'],
                    'course_title' => $p['course_title'],
                    'dept_code'    => $p['dept_code']
                ],
                'trimester'        => [
                    'trimester_id'   => (int)$p['trimester_id'],
                    'trimester_code' => $p['trimester_code'],
                    'term_name'      => $p['term_name'],
                    'year'           => (int)$p['year'],
                    'session'        => $p['academic_session']
                ],
                'supervisor'       => $p['supervisor_name'] ? [
                    'name'  => $p['supervisor_name'],
                    'email' => $p['supervisor_email']
                ] : null,
                'award'            => $p['award_id'] ? [
                    'award_id'     => (int)$p['award_id'],
                    'award_title'  => $p['award_title'],
                    'prize_money'  => (float)$p['prize_money'],
                    'remarks'      => $p['award_remarks'],
                    'event_title'  => $p['event_title'],
                    'event_date'   => $p['event_date']
                ] : null,
                'leader'           => [
                    'name'       => $leaderName,
                    'student_id' => $leaderId
                ],
                'members'          => $teamMembers
            ];
        }
    }

    // 4. Fetch Dynamic Meta Data for Dropdowns & Stats
    // Active Courses
    $coursesStmt = $pdo->query("
        SELECT c.course_id, c.course_code, c.course_title, d.dept_code,
               (SELECT COUNT(*) FROM projects p WHERE p.course_id = c.course_id) AS project_count
        FROM courses c 
        INNER JOIN departments d ON c.dept_id = d.dept_id
        WHERE c.is_active = 1
        ORDER BY c.course_code ASC
    ");
    $activeCourses = $coursesStmt->fetchAll();

    // Trimesters
    $trimestersStmt = $pdo->query("
        SELECT trimester_id, trimester_code, term_name, year,
               CONCAT(term_name, ' ', year) AS session_label,
               (SELECT COUNT(*) FROM projects p WHERE p.trimester_id = t.trimester_id) AS project_count
        FROM trimesters t
        ORDER BY year DESC, term_name ASC
    ");
    $trimesters = $trimestersStmt->fetchAll();

    // Overall KPI statistics
    $statsStmt = $pdo->query("
        SELECT 
            (SELECT COUNT(*) FROM projects) AS total_projects,
            (SELECT COUNT(*) FROM projects WHERE course_id IN (SELECT course_id FROM courses WHERE course_code LIKE 'CSE 4000%')) AS total_fydp,
            (SELECT COUNT(*) FROM awards) AS total_award_winners,
            (SELECT COALESCE(SUM(prize_money), 0) FROM awards) AS total_prize_distributed,
            (SELECT COUNT(DISTINCT user_id) FROM project_members) AS total_student_innovators
    ");
    $stats = $statsStmt->fetch();

    // Top dynamic tech stack keywords
    $allTechsStmt = $pdo->query("SELECT tech_stack FROM projects");
    $techKeywords = [];
    while ($row = $allTechsStmt->fetch()) {
        $parts = explode(',', $row['tech_stack']);
        foreach ($parts as $tech) {
            $tech = trim($tech);
            if (!empty($tech)) {
                $techKeywords[$tech] = ($techKeywords[$tech] ?? 0) + 1;
            }
        }
    }
    arsort($techKeywords);
    $topTechs = array_slice(array_keys($techKeywords), 0, 16);

    // Faculty supervisors for dynamic Add Project modal
    $supervisorsStmt = $pdo->query("
        SELECT user_id, full_name, student_or_faculty_id, email 
        FROM users 
        WHERE role = 'faculty'
        ORDER BY full_name ASC
    ");
    $supervisors = $supervisorsStmt->fetchAll();

    sendJsonResponse([
        'success'  => true,
        'count'    => count($projects),
        'projects' => $projects,
        'meta'     => [
            'stats'         => $stats,
            'courses'       => $activeCourses,
            'trimesters'    => $trimesters,
            'supervisors'   => $supervisors,
            'popular_techs' => $topTechs,
            'award_types'   => [
                'all'             => 'All Projects',
                'winners_only'    => '🏆 All Award Winners',
                '1st_prize'       => '🥇 1st Prize Winners',
                '2nd_prize'       => '🥈 2nd Prize Winners',
                '3rd_prize'       => '🥉 3rd Prize Winners',
                'best_fydp'       => '🌟 Best FYDP Champions',
                'best_innovation' => '💡 Best Innovation Winners'
            ]
        ]
    ]);

} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Failed to load projects: ' . $e->getMessage()
    ], 500);
}
