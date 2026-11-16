<?php
/**
 * UIU Project Showcase & Archive System
 * Course: CSE 3522 — Database Management Systems Laboratory
 * 
 * Database Configuration & PDO Connection Utility
 * Target Environment: Localhost via XAMPP (Apache + MySQL 8.0+)
 */

// Error reporting during local testing
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Local XAMPP MySQL credentials
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'uiu_project_showcase');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Get the PDO Database Connection instance.
 *
 * @return PDO
 * @throws PDOException
 */
function getDBConnection(): PDO {
    static $pdoInstance = null;

    if ($pdoInstance === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_CHARSET
        );

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdoInstance = new PDO($dsn, DB_USER, DB_PASS, $options);
            $pdoInstance->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (PDOException $e) {
            error_log('Database Connection Error: ' . $e->getMessage());
            
            if (php_sapi_name() !== 'cli') {
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection failed. Please ensure MySQL is running in XAMPP and "uiu_project_showcase" database is imported.',
                    'error_details' => $e->getMessage()
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                exit;
            } else {
                throw $e;
            }
        }
    }

    return $pdoInstance;
}

/**
 * Helper to emit clean JSON responses with proper headers and CORS
 *
 * @param array $data
 * @param int $statusCode
 */
function sendJsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
