<?php
$servername = "remotemysql.com";
$username = "DNidXqyh7U";
$password = "x2eR4raZGa";
$dbname = "DNidXqyh7U";

$conn = new mysqli($servername, $username, $password, $dbname);

if($conn->connect_error){
    die("Could not connect to database!");
}

$res = array("error" => false);

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

    $result = $conn->query("INSERT INTO `main_group` (group_code,group_name,exchange_gift_date,signup_deadline,spending_minimum,admin_name,admin_email,admin_password) 
    VALUES 
    ('$group_code', '$group_name', '$exchange_gift_date', '$signup_deadline', '$spending_minimum', '$admin_name', '$admin_email', '$admin_password')");

    if($result){
        $res['message'] = "New group added succesfully!";
    } else{
        $res['error'] = true;
        $res['message'] = "Error: Could not add group or there might be some error.";
    }

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


$conn->close();

header("Content-type: application/json");
// $json = json_decode($res);
echo json_encode($res, JSON_PRETTY_PRINT);
die();