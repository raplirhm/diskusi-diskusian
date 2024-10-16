<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

header('Content-Type: application/json');
$host = 'localhost';
$db = 'discuss';
$user = 'root'; 
$pass = ''; 

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$requestMethod = $_SERVER['REQUEST_METHOD'];

switch ($requestMethod) {
    case 'POST':
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'register':
                    register($conn);
                    break;
                case 'login':
                    login($conn);
                    break;
                case 'createPost':
                    createPost($conn);
                    break;
                case 'addComment':
                    addComment($conn);
                    break;
            }
        }
        break;
    case 'GET':
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'getPosts':
                    getPosts($conn);
                    break;
            }
        }
        break;
    default:
        echo json_encode(['error' => 'Invalid request']);
}

function register($conn) {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $checkStmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $checkStmt->bind_param("s", $username);
    $checkStmt->execute();
    $checkStmt->bind_result($count);
    $checkStmt->fetch();
    $checkStmt->close();

    if ($count > 0) {
        echo json_encode(['error' => 'Username already exists']);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Registration failed']);
    }
    $stmt->close();
}


function login($conn) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            echo json_encode(['success' => true, 'user' => $user]);
            return;
        }
    }
    echo json_encode(['error' => 'Invalid username or password']);
}

function getPosts($conn) {
    $result = $conn->query("SELECT posts.id, posts.title, posts.content, users.username, posts.created_at FROM posts JOIN users ON posts.user_id = users.id");
    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
    echo json_encode($posts);
}

function createPost($conn) {
    $user_id = $_POST['user_id'];
    $title = $_POST['title'];
    $content = $_POST['content'];
    $stmt = $conn->prepare("INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $title, $content);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Post creation failed']);
    }
    $stmt->close();
}

function addComment($conn) {
    $user_id = $_POST['user_id'];
    $post_id = $_POST['post_id'];
    $comment = $_POST['comment'];
    
    $stmt = $conn->prepare("INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $user_id, $post_id, $comment);
    
    if ($stmt->execute()) {
        $newCommentId = $stmt->insert_id; 
        echo json_encode(['success' => true, 'id' => $newCommentId]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error adding comment']);
    }
    
    $stmt->close();
}


function getComments($conn) {
    $post_id = $_GET['post_id'];
    
    $stmt = $conn->prepare("SELECT comments.comment, comments.created_at, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = ?");
    $stmt->bind_param("i", $post_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $comments = [];
    
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }
    
    echo json_encode($comments);
    $stmt->close();
}

if ($_GET['action'] == 'getComments') {
    getComments($conn);
}

function getUserPosts($conn) {
    $user_id = $_GET['user_id'];
    
    $stmt = $conn->prepare("SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $posts = [];
    
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
    
    echo json_encode($posts);
    $stmt->close();
}

if ($_GET['action'] == 'getUserPosts') {
    getUserPosts($conn);
}



$action = $_GET['action'];

switch($action) {
    case 'editPost':
        editPost();
        break;
}

function editPost() {
    $data = json_decode(file_get_contents("php://input"), true);
    $post_id = $data['post_id'];
    $content = $data['content'];

    $conn = new mysqli("localhost", "root", "", "discuss");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("UPDATE posts SET content = ? WHERE id = ?");
    $stmt->bind_param("si", $content, $post_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Post updated successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update post"]);
    }

    $stmt->close();
    $conn->close();
}

if ($_GET['action'] == 'deletePost') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['post_id'])) {
        $post_id = $data['post_id'];

        $sql = "DELETE FROM posts WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $post_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Post deleted']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting post']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Post ID not provided']);
    }
}

if ($_GET['action'] == 'getUserProfile' && isset($_GET['username'])) {
    $username = $_GET['username'];

    $sql = "SELECT posts.*, users.username FROM posts 
            JOIN users ON posts.user_id = users.id 
            WHERE users.username = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    $posts = array();
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }

    echo json_encode($posts);
    exit();
}



?>
