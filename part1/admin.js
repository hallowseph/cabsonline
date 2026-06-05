/*
    Student:     Joseph Reanzares
    Student ID:  xxg8089
    File:        admin.js
    Description: Client-side JavaScript for the CabsOnline admin page.
                 Validates booking reference format, sends search and
                 assign requests to admin.php using the Fetch API,
                 and updates the page using DOM manipulation.

    Functions:
        - searchBooking():          Called by Search button. Validates input,
                                    sends search request to admin.php, builds results table.
        - validateReference(ref):   Checks that ref matches BRN format (e.g. BRN00001).
                                    Returns true if valid, false if not.
        - displayResults(bookings): Builds and inserts the results table into the page.
        - assignTaxi(reference):    Called by each Assign button. Sends assign
                                    request to admin.php and updates the page.
*/

//searchBooking - called when the Search button is clicked
//if input is non-empty, it validates the format first then sends the search to admin.php and displays results
function searchBooking() {
    var bsearch = document.getElementById('bsearch').value.trim();

    //if non-empty input, validate the format before sending
    if (bsearch !== '') {
        if (!validateReference(bsearch)) {
            alert('Invalid format. Please enter a valid booking reference number (e.g. BRN00001).');
            return;
        }
    }

    //clear previous results and confirmation before showing new ones
    document.getElementById('results').innerHTML = '';
    var confDiv = document.getElementById('confirmation');
    confDiv.style.display = 'none';
    confDiv.innerHTML = '';

    //send search request to admin.php via Fetch
    fetch('admin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'search', bsearch: bsearch })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.status === 'success') {
            if (data.bookings.length === 0) {
                //no records found - tell the user
                document.getElementById('results').innerHTML = '<p>No bookings found.</p>';
            } else {
                //build and display the results table
                displayResults(data.bookings);
            }
        } else {
            alert('Search error: ' + data.message);
        }
    })
    .catch(function(error) {
        alert('Connection error: ' + error);
    });
}


//validateReference - checks that the input matches the booking reference format: BRN followed by exactly 5 digits
//^ = start of string, BRN = literal letters, \d{5} = exactly 5 digits, $ = end of string
//returns true if valid, false if not
function validateReference(ref) {
    var pattern = /^BRN\d{5}$/;
    return pattern.test(ref);
}


//displayResults - builds an HTML table from the bookings array returned by admin.php
//each row includes an Assign button that calls assignTaxi() with the reference
function displayResults(bookings) {
    //build the table as an HTML string
    var html = '<table border="1">';
    html += '<tr>';
    html += '<th>Booking Reference</th>';
    html += '<th>Customer Name</th>';
    html += '<th>Phone Number</th>';
    html += '<th>Pickup Suburb</th>';
    html += '<th>Destination Suburb</th>';
    html += '<th>Pickup Date & Time</th>';
    html += '<th>Status</th>';
    html += '<th>Action</th>';
    html += '</tr>';

    //loop through each booking and create a table row
    //same structure as what admin.php sends back
    for (var i = 0; i < bookings.length; i++) {
        var b = bookings[i];

        html += '<tr id="row-' + b.reference + '">';
        html += '<td>' + b.reference + '</td>';
        html += '<td>' + b.name + '</td>';
        html += '<td>' + b.phone + '</td>';
        html += '<td>' + b.suburb + '</td>';
        html += '<td>' + b.dest_suburb + '</td>';
        html += '<td>' + b.date + ' ' + b.time + '</td>';
        //gave the status cell an id so that it can be updated later without rebuilding the table
        html += '<td id="status-' + b.reference + '">' + b.status + '</td>';
        //the Assign button calls assignTaxi() and passes the reference number
        //only show the button if the booking is still unassigned
        if (b.status === 'unassigned') {
            html += '<td><button onclick="assignTaxi(\'' + b.reference + '\')">Assign</button></td>';
        } else {
            html += '<td>-</td>';
        }
        html += '</tr>';
    }

    html += '</table>';

    //insert the completed table into the results div using innerHTML
    document.getElementById('results').innerHTML = html;
}


//assignTaxi - called when Assign button is clicked
//sends an assign request to admin.php with the booking reference
//on success, updates the status cell and button in the table without reloading and displays a confirmation message
function assignTaxi(reference) {

    //send assign request to admin.php via Fetch
    fetch('admin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign', reference: reference })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.status === 'success') {
            //update the status cell in the existing table row - no reload needed
            document.getElementById('status-' + reference).innerHTML = 'assigned';

            //replace the Assign button with a disabled grayed-out button (optional per brief)
            //the button is the last <td> in the row, so get the row and update the last cell
            var row = document.getElementById('row-' + reference);
            var cells = row.getElementsByTagName('td');
            cells[cells.length - 1].innerHTML = '<button disabled style="opacity:0.4;cursor:not-allowed;">Assign</button>';

            //show confirmation message below the table
            var confDiv = document.getElementById('confirmation');
            confDiv.style.display = 'block';
            confDiv.innerHTML = '<p>Congratulations! Booking request <strong>'
                + reference + '</strong> has been assigned!</p>';

        } else {
            alert('Assignment failed: ' + data.message);
        }
    })
    .catch(function(error) {
        alert('Connection error: ' + error);
    });
}