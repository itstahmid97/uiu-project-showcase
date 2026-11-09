<?php
/**
 * UIU Project Showcase & Archive System
 * Database Configuration & PDO Connection Utility
 * 
 * Target Environment: XAMPP (Apache + MySQL 8.0+)
 * Safe PDO Implementation with Prepared Statements & Exception Handling
 */

// Strict error reporting during development
error_reporting(E_ALL);
ini_set('display_errors', '0');

// ==============================================================================
// DATABASE ENVIRONMENT SELECTOR
// Toggle $USE_CLOUD_DB = true to connect to your TiDB Cloud database,
// or false to use your local XAMPP MySQL database.
// ==============================================================================
$USE_CLOUD_DB = true; // Set to true for TiDB Cloud, false for local XAMPP

if ($USE_CLOUD_DB || getenv('USE_CLOUD_DB') === '1' || (getenv('DB_HOST') && strpos(getenv('DB_HOST'), 'tidbcloud') !== false)) {
    // Cloud TiDB Serverless Credentials
    define('DB_HOST', getenv('DB_HOST') ?: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com');
    define('DB_PORT', getenv('DB_PORT') ?: '4000');
    define('DB_NAME', getenv('DB_NAME') ?: 'test');
    define('DB_USER', getenv('DB_USER') ?: '22ydzKbVH35butT.root');
    define('DB_PASS', getenv('DB_PASS') ?: 'F33m6ntRoE78q7vC');
    define('DB_IS_CLOUD', true);
} else {
    // Local XAMPP MySQL Credentials
    define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
    define('DB_PORT', getenv('DB_PORT') ?: '3306');
    define('DB_NAME', getenv('DB_NAME') ?: 'uiu_project_showcase');
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
    define('DB_IS_CLOUD', false);
}
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

        // Handle TiDB Cloud SSL requirement
        if (defined('DB_IS_CLOUD') && DB_IS_CLOUD) {
            $caPaths = [
                '/etc/ssl/cert.pem',
                '/etc/ssl/certs/cacert.pem',
                '/usr/local/etc/openssl/cert.pem',
                '/opt/homebrew/etc/openssl@3/cert.pem'
            ];
            $ca = null;
            foreach ($caPaths as $p) {
                if (file_exists($p)) { $ca = $p; break; }
            }
            if (defined('Pdo\Mysql::ATTR_SSL_CA')) {
                $options[\Pdo\Mysql::ATTR_SSL_CA] = $ca ?: true;
            } else {
                $options[PDO::MYSQL_ATTR_SSL_CA] = $ca ?: true;
            }
        }

        try {
            $pdoInstance = new PDO($dsn, DB_USER, DB_PASS, $options);
            $pdoInstance->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (PDOException $e) {
            // Log error internally and return structured JSON response if an API called it
            error_log('Database Connection Error: ' . $e->getMessage());
            
            if (php_sapi_name() !== 'cli') {
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection failed. Please ensure MySQL is running in XAMPP and "uiu_project_showcase" database is imported.',
                    'error_code' => $e->getCode(),
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
