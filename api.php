<?php
$servername = "remotemysql.com";
$username = "DNidXqyh7U";
$password = "x2eR4raZGa";
$dbname = "DNidXqyh7U";

$conn = new mysqli($servername, $username, $password, $dbname);

$res = array("error" => false);

if($conn->connect_error){
    $res['error'] = true;
    $res['message'] = "Error: Could not connect to database!";
    die("Could not connect to database!");
}

$action = 'read';

if(isset($_GET['action'])){
    $action = $_GET['action'];
}

// Reading data from table main_group
if($action == 'read'){
    $result = $conn->query("SELECT * FROM `main_group`");
    $main_group = array();

    while($row = $result ->fetch_assoc()){
        array_push($main_group, $row);
    }

    // $count = $conn->query( "SELECT COUNT(admin_email) FROM `main_group` WHERE admin_email='masie@yahoo.com'" );
    // array_push($main_group, mysqli_num_rows($count));

    $res['main_group'] = $main_group;

}

// Adding new group to the main_group table
if($action == 'create'){
    $group_code = $_POST['group_code'];
    $group_name = $_POST['group_name'];
    $exchange_gift_date = $_POST['exchange_gift_date'];
    $signup_deadline = $_POST['signup_deadline'];
    $spending_minimum = $_POST['spending_minimum'];
    $admin_name = $_POST['admin_name'];
    $admin_email = $_POST['admin_email'];
    $admin_password = $_POST['admin_password'];

    // Check admin_email if it already exists on the DB
    // $sql = "SELECT (admin_email) FROM `main_group` WHERE admin_email = '$admin_email'";
    // $result = mysql_result(mysql_query($sql),0);

    // if( checkEmailIfExist($admin_email) ){
    //     $res['error'] = true;
    //     $res['message'] = "Error: Email already exist.";
    // }
    // else {
        $result = $conn->query("INSERT INTO `main_group` (group_code,group_name,exchange_gift_date,signup_deadline,spending_minimum,admin_name,admin_email,admin_password) 
        VALUES 
        ('$group_code', '$group_name', '$exchange_gift_date', '$signup_deadline', '$spending_minimum', '$admin_name', '$admin_email', '$admin_password')");

        if($result){
            $res['message'] = "Group name " . $group_name . " added succesfully!";
        } else{
            $res['error'] = true;
            $res['message'] = "Error: Could not create group or there might be some error.";
        }
    // }

}

// Updating main group data
if($action == 'update'){
    $group_id = $_POST['group_id'];
    $group_name = $_POST['group_name'];
    $exchange_gift_date = $_POST['exchange_gift_date'];
    $signup_deadline = $_POST['signup_deadline'];
    $spending_minimum = $_POST['spending_minimum'];

    $result = $conn->query("UPDATE `main_group` SET `group_name` = '$group_name', exchange_gift_date = '$exchange_gift_date', signup_deadline = '$signup_deadline', spending_minimum = '$spending_minimum' WHERE group_id = '$group_id'");
    
    if($result){
        $res['message'] = "Group updated succesfully!";
    } else{
        $res['error'] = true;
        $res['message'] = "Error: Could not update group!";
    }

}

// Delete entry in main group
if($action == 'delete'){
    $group_id = $_POST['group_id'];

    $result = $conn->query("DELETE FROM `main_group` WHERE group_id = '$group_id'");
    
    if($result){
        $res['message'] = "Group deleted succesfully!";
    } else{
        $res['error'] = true;
        $res['message'] = "Error: Could not delete group!";
    }

}

function checkEmailIfExist($email){
    // $sql = "SELECT admin_email FROM `main_group` WHERE admin_email='$email'" ;
    $result = $conn->query( "SELECT COUNT(admin_email) FROM `main_group` WHERE admin_email='$email'" );

    if( mysqli_num_rows( $result ) > 0 ){
        return true;
    }

    return false;
}


$conn->close();

header("Content-type: application/json");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With,Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');
echo json_encode($res, JSON_PRETTY_PRINT);
die();