/*
    Student:     Joseph Reanzares
    Student ID:  xxg8089
    File:        booking.js
    Description: Client-side JavaScript for the CabsOnline booking page.
                 Validates form inputs and sends data to booking.php
                 using the Fetch API asynchronously.

    Functions:
        - getCurrentDate():  Returns today's date in YYYY-MM-DD format for the date input
        - getCurrentTime():  Returns current time in HH:MM 24-hour format
        - validateForm():    Validates all required form fields
        - submitBooking():   Sends form data to booking.php via Fetch
        - window.onload:     Pre-fills date and time fields on page load
*/

//window.onload
window.onload = function(){
    document.getElementById('date').value = getCurrentDate();
    document.getElementById('time').value = getCurrentTime();
};

//getCurrentDate - returns today's date in YYYY-MM-DD format for the date input field
//type="date" inputs require YYYY-MM-DD format internally
function getCurrentDate(){
    var now = new Date();

    //getDate() = day of month (1-31)
    //getMonth() = month index 0-11, +1
    //getFullYear() = four-digit year
    //padStart(2, '0') = adds a leading zero if single digit

    var day = String(now.getDate()).padStart(2,'0');
    var month = String(now.getMonth() + 1).padStart(2,'0');
    var year = now.getFullYear();

    return year + '-' + month + '-' + day;
}

//getCurrentTime - returns current time in HH:MM 24-hour format
function getCurrentTime(){
    var now = new Date();

    //getHours() = hour in 24h format
    //getMinutes() = minutes

    var hours = String(now.getHours()).padStart(2,'0');
    var minutes = String(now.getMinutes()).padStart(2,'0');

    return hours + ':' + minutes;
}

//validateForm - checks all required fields are filled and pickup is not in the past
//returns true if valid, false if not
function validateForm(){
    //collect values from required fields
    //.trim() removes accidental spaces at the start or end of inputs
    var cname = document.getElementById('cname').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var snumber = document.getElementById('snumber').value.trim();
    var stname = document.getElementById('stname').value.trim();
    var date = document.getElementById('date').value.trim();
    var time = document.getElementById('time').value.trim();

    //check that required fields are not empty
    //unit number and suburb are optional so not checked here
    if(cname === ''){
        alert('Please enter your name.');
        return false;
    }

    //check phone is not empty
    if(phone === ''){
        alert('Please enter your phone number.');
        return false;
    }

    //strip spaces then check phone is 10-12 digits only
    //e.g. "0210 282 0971" becomes "02102820971" = 11 digits = valid
    var phoneDigits = phone.replace(/\s/g, '');
    var phonePattern = /^\d{10,12}$/;
    if(!phonePattern.test(phoneDigits)){
        alert('Phone number must be between 10 and 12 digits (spaces allowed).');
        return false;
    }

    if(snumber === ''){
        alert('Please enter your street number.');
        return false;
    }
    if(stname === ''){
        alert('Please enter your street name.');
        return false;
    }
    if(date === ''){
        alert('Please enter a pickup date.');
        return false;
    }
    if(time === ''){
        alert('Please enter a pickup time.');
        return false;
    }

    //check that pickup date/time is not in the past
    //type="date" input gives YYYY-MM-DD format which new Date() understands directly
    var pickupDateTime = new Date(date + 'T' + time + ':00');
    var now = new Date();

    if(pickupDateTime < now){
        alert('Pickup date and time cannot be in the past.');
        return false;
    }

    return true;
}

//submitBooking - called when Book Now button is clicked
//validates the form then sends data to booking.php via Fetch
//displays confirmation message on the page without reloading
function submitBooking(){
    //run validation first - will stop here if anything is invalid
    if (!validateForm()){
        return;
    }

    //collect all form field values into one object
    //must match what booking.php reads with $data["..."]
    //date input gives YYYY-MM-DD, convert to DD/MM/YYYY for booking.php
    var rawDate = document.getElementById('date').value;
    var dateParts = rawDate.split('-'); // ["2026", "05", "10"]
    var displayDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0]; // "10/05/2026"

    var formData = {
        cname: document.getElementById('cname').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        unumber: document.getElementById('unumber').value.trim(),
        snumber: document.getElementById('snumber').value.trim(),
        stname: document.getElementById('stname').value.trim(),
        sbname: document.getElementById('sbname').value.trim(),
        dsbname: document.getElementById('dsbname').value.trim(),
        date: displayDate,
        time: document.getElementById('time').value.trim()
    };

    //send formData to booking.php using the Fetch API
    //JSON.stringify() converts the JS object into a JSON string for sending
    fetch('booking.php',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(formData)
    })
    .then(function(response){
        //response.json() reads the body and converts the JSON string back to a JS object
        return response.json();
    })
    .then(function(data){
        //data is now a JS object e.g. { status: "success", reference: "BRN00001", ... }
        if(data.status === 'success'){
            //display confirmation message in structured format as per assignment requirements
            var refDiv = document.getElementById('reference');
            refDiv.style.display = 'block';
            refDiv.innerHTML =
            '<p><strong>Thank you for your booking!</strong></p>'
            +'<p>Booking reference number: <strong>' + data.reference + '</strong><br>'
            +'Pickup date: ' + data.date + '<br>'
            +'Pickup time: ' + data.time + '</p>';
        } else {
            //error message from PHP if the insert failed
            alert('Booking failed: ' + data.message);
        }
    })
    .catch(function(error){
        //.catch() handles network errors (e.g. server unreachable)
        alert('Connection error: ' + error);
    });
}