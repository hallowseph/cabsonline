<?php
/*
    Student:     Joseph Reanzares
    Student ID:  xxg8089
    File:        booking.php
    Description: Server-side PHP script for the CabsOnline booking system.
                 Receives booking data from booking.html via Fetch,
                 generates a booking reference number, inserts the record
                 into the MySQL database, and returns a confirmation message.
Processing steps (no named functions - script runs top to bottom):
        1. Connect to MySQL database
        2. Read and sanitise incoming JSON data
        3. Generate unique booking reference number (BRN + 5 digits)
        4. Convert date format from DD/MM/YYYY to YYYY-MM-DD for MySQL
        5. Insert booking record into the bookings table
        6. Return JSON confirmation with reference, date, and time
*/

//include db credentials
require_once('../../files/sqlinfo.inc.php');


//connect to db
$conn = @mysqli_connect($sql_host,
		$sql_user,
		$sql_pass,
		$sql_db
	);

//check if connected    
if(!$conn){
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Database connection failure"]);
    exit;
} else{
    //connection success

    // Get data sent from booking.js via Fetch
    $data = json_decode(file_get_contents('php://input'), true);

    $cname   = mysqli_real_escape_string($conn, $data["cname"]);
    $phone   = mysqli_real_escape_string($conn, $data["phone"]);
    $unumber = mysqli_real_escape_string($conn, $data["unumber"]);
    $snumber = mysqli_real_escape_string($conn, $data["snumber"]);
    $stname = mysqli_real_escape_string($conn, $data["stname"]);
    $sbname = mysqli_real_escape_string($conn, $data["sbname"]);
    $dsbname = mysqli_real_escape_string($conn, $data["dsbname"]);
    $date = mysqli_real_escape_string($conn, $data["date"]);
    $time = mysqli_real_escape_string($conn, $data["time"]);

    // Generate booking reference number
    // Get count of existing records to determine next number
    $countQuery = mysqli_query($conn, "SELECT COUNT(*) FROM bookings");
    $countRow = mysqli_fetch_row($countQuery);
    $nextNumber = $countRow[0] + 1;

    // Format as BRN00001 (BRN + 5 digits padded with zeros)
    $booking_reference = "BRN" . str_pad($nextNumber, 5, "0", STR_PAD_LEFT);

    // Generate booking timestamp
    $booking_date_time = date("Y-m-d H:i:s");

    // Convert date from DD/MM/YYYY to YYYY-MM-DD for MySQL
    $dateParts = explode("/", $date);
    $mysql_date = $dateParts[2] . "-" . $dateParts[1] . "-" . $dateParts[0];

    // Set up the SQL INSERT query
    $query = "INSERT INTO bookings 
        (booking_reference, customer_name, phone_number, unit_number, 
        street_number, street_name, suburb, destination_suburb, 
        pickup_date, pickup_time, booking_date_time, status) 
        VALUES 
        ('$booking_reference', '$cname', '$phone', '$unumber', 
        '$snumber', '$stname', '$sbname', '$dsbname', 
        '$mysql_date', '$time', '$booking_date_time', 'unassigned')";

    // Execute the query
    $result = mysqli_query($conn, $query);
    
    // Check if the query was successful
    if(!$result) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => "Database insert failed"]);
    } else {
        // Format date back to DD/MM/YYYY for the confirmation message
        header('Content-Type: application/json');
        echo json_encode(["status" => "success", "reference" => $booking_reference,
        "date" => $date, "time" => $time]);
    }

    // Close the database connection
    mysqli_close($conn);


    
}


?>