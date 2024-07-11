function searchTable() {
    var searchValue = document.getElementById('searchInput').value.toLowerCase();
    var tableRows = document.getElementById('tableBody').getElementsByTagName('tr');
    var found = false;

    // Iterate through each row in the table body
    for (var i = 0; i < tableRows.length; i++) {
        var cells = tableRows[i].getElementsByTagName('td');

        // Iterate through each cell in the row
        for (var j = 0; j < cells.length; j++) {
            var cellText = cells[j].innerText.toLowerCase();

            // Check if the search value is present in the cell
            if (cellText.includes(searchValue)) {
                tableRows[i].style.display = ''; // Show the row if it matches the search
                found = true;
                break; // Move to the next row
            } else {
                tableRows[i].style.display = 'none'; // Hide the row if it doesn't match the search
            }
        }
    }

    if (!found) {
        alert('No matching rows found for: ' + searchValue);
    }
}
