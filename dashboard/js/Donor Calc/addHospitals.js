
document.addEventListener('DOMContentLoaded', function () {
    // Load hospitals from localStorage if available
    var hospitals = JSON.parse(localStorage.getItem('hospitals')) || [];

    // Function to save hospitals to localStorage
    function saveHospitals() {
        localStorage.setItem('hospitals', JSON.stringify(hospitals));
    }

    // Function to open modal with message
    function openConfirmationModal(message, confirmCallback) {
        var modalMessage = document.getElementById('modalMessage');
        modalMessage.textContent = message;
        $('#confirmationModal').modal('show');

        // Set up confirm action button click event
        var confirmActionBtn = document.getElementById('confirmActionBtn');
        confirmActionBtn.onclick = function () {
            confirmCallback();
            $('#confirmationModal').modal('hide');
        };
    }

    // Function to add a hospital
    function addHospital(hospitalName) {
        // Check if the hospital is already added
        if (!hospitals.includes(hospitalName)) {
            openConfirmationModal(`Are you sure you want to add hospital ${hospitalName.toUpperCase()} ?`, function () {
                hospitals.push(hospitalName);
                saveHospitals();
                createHospitalItem(hospitalName);
            });
        }
    }

    // Function to remove a hospital
    function removeHospital(hospitalName) {
        var index = hospitals.indexOf(hospitalName);
        if (index !== -1) {
            openConfirmationModal(`Are you sure you want to remove ${hospitalName} hospital?`, function () {
                hospitals.splice(index, 1);
                saveHospitals();
                removeHospitalItem(hospitalName);
            });
        }
    }

    // Function to create a hospital item in the sidebar
    function createHospitalItem(hospitalName) {
        var newHospitalItem = document.createElement('li');
        newHospitalItem.className = 'nav-item';
        newHospitalItem.id = `hospital_${hospitalName}`; // Set an ID for easy reference
        newHospitalItem.innerHTML = `
        <a class="nav-link" href="#" data-toggle="collapse" data-target="#collapse${hospitalName}" aria-expanded="true" aria-controls="collapse${hospitalName}">
            <i class="fas fa-fw fa-hospital"></i>
            <span>Hospital ${hospitalName}</span>
        </a>
        <div id="collapse${hospitalName}" class="collapse" aria-labelledby="heading${hospitalName}" data-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">${hospitalName}:</h6>
                <a class="collapse-item" href="donor req${hospitalName}.html">Add donor</a>
                <a class="collapse-item" href="patient req${hospitalName.toLowerCase()}.html">Add patient</a>
                <a class="collapse-item" href="donor${hospitalName.toLowerCase()}.html">donors</a>
                <a class="collapse-item" href="patient${hospitalName.toLowerCase()}.html">patients</a>
                <a class="collapse-item" href="expiry${hospitalName.toUpperCase()}.html">expired Blood</a>
            </div>
        </div>
        
    `;
        // Append the new <li> element to the sidebar
        document.getElementById('accordionSidebar').appendChild(newHospitalItem);
    }

    // Function to remove a hospital item from the sidebar
    function removeHospitalItem(hospitalName) {
        var item = document.getElementById(`hospital_${hospitalName}`);
        if (item) {
            item.remove();
        }
    }

    // Add event listener to the "Add Hospital" button
    document.getElementById('addHospitalButton').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior of the link
        // Prompt the user for the hospital name
        var hospitalName = prompt('Enter the name of the hospital:');
        // Check if the user entered a hospital name
        if (hospitalName) {
            addHospital(hospitalName);
        }
    });

    // Add event listener to the "Delete Hospital" button
    document.getElementById('delHospitalButton').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior of the link
        // Prompt the user for the hospital name
        var hospitalName = prompt('Enter the name of the hospital to delete:');
        // Check if the user entered a hospital name
        if (hospitalName) {
            removeHospital(hospitalName);
        }
    });

    // Populate hospitals on page load
    hospitals.forEach(function (hospitalName) {
        createHospitalItem(hospitalName);
    });
});
