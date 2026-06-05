<?php
/*
    Student:     Joseph Reanzares
    Student ID:  xxg8089
    File:        admin.php
    Description: Server-side PHP script for the CabsOnline admin page.
                 Handles two actions sent from admin.js via Fetch:
                 - "search": finds a booking by reference number, or returns
                   unassigned bookings within 2 hours if no reference given.
                 - "assign": updates a booking status from unassigned to assigned.
Processing steps (no named functions - script runs top to bottom):
        1. Connect to MySQL database
        2. Read incoming JSON and determine action (search or assign)
        3. search: query bookings by reference or return unassigned within 2 hours
        4. assign: update booking status from unassigned to assigned
        5. Return JSON response for each action
*/ 

//include db credentials
require_once('../../files/sqlinfo.inc.php');

//connect to db
$conn = @mysqli_connect($sql_host, $sql_user, $sql_pass, $sql_db);

//check if connected
if (!$conn) {
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Database connection failure"]);
    exit();
}

//get data sent from admin.js via Fetch
//json_decode reads the raw JSON body and converts it into a PHP array
$data = json_decode(file_get_contents('php://input'), true);

$action = $data["action"];

//Action: Search
if ($action === "search") {
    $bsearch = mysqli_real_escape_string($conn, $data["bsearch"]);

    if($bsearch !== "") {
        //non-empty search:find the booking by reference number 
        $query = "SELECT booking_reference, customer_name, phone_number, 
        suburb, destination_suburb, pickup_date, pickup_time, status
        FROM bookings
        WHERE booking_reference = '$bsearch'";
    } else {
        //empty search: return all unassigned bookings with pickup within the next 2 hours
        //DATE_ADD(NOW(), INTERVAL 2 HOUR) = current time + 2 hours
        //CURDATE() =today's date
        //TIME(NOW()) = current time
        $query = "SELECT booking_reference, customer_name, phone_number,
        suburb, destination_suburb, pickup_date, pickup_time, status
        FROM bookings
        WHERE status = 'unassigned'
        AND pickup_date = CURDATE()
        AND pickup_time >= TIME(NOW())
        AND pickup_time <= TIME(DATE_ADD(NOW(), INTERVAL 2 HOUR))";
    }

    //Execute the query
    $result = mysqli_query($conn, $query);

    if(!$result) {
        header('Content-Type: application/json');
        echo json_encode(["status"=> "error","message" => "Query failed"]);
    } else {
        //build an array of booking records to send back as json
        $bookings = [];
        while ($row = mysqli_fetch_assoc($result)) {
            //format date from YYYY-MM-DD to DD/MM/YYYY for display
            $dateParts = explode("-", $row["pickup_date"]);
            $displayDate = $dateParts[2] . "/" . $dateParts[1] . "/" . $dateParts[0];

            $bookings[] = [
                "reference"   => $row["booking_reference"],
                "name"        => $row["customer_name"],
                "phone"       => $row["phone_number"],
                "suburb"      => $row["suburb"],
                "dest_suburb" => $row["destination_suburb"],
                "date"        => $displayDate,
                "time"        => $row["pickup_time"],
                "status"      => $row["status"]
            ];
        }

        mysqli_free_result($result);

        header('Content-Type: application/json');
        echo json_encode(["status" => "success", "bookings" => $bookings]);            
    }
    //action:assign
} else if ($action === "assign"){
    $reference = mysqli_real_escape_string($conn, $data["reference"]);
 
    // Update the status of the booking from unassigned to assigned
    $query = "UPDATE bookings SET status = 'assigned' WHERE booking_reference = '$reference'";
 
    $result = mysqli_query($conn, $query);
 
    header('Content-Type: application/json');
 
    if (!$result) {
        echo json_encode(["status" => "error", "message" => "Update failed"]);
    } else {
        echo json_encode(["status" => "success", "reference" => $reference]);
    }
}
 
// Close the database connection
mysqli_close($conn);
?>