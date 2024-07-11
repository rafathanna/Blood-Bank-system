document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values using specific variable names
    const fullName = document.getElementById('validationCustom01').value;
    const age = document.getElementById('validationCustom02').value;
    const city = document.getElementById('validationCustom03').value;
    const bloodAmount = document.getElementById('validationCustomamount').value;
    const bloodType = document.getElementById('validationCustom05').value;
    const hospital = document.getElementById('validationCustom06').value;
    const gender = document.getElementById('validationCustom07').value;
    const date = document.getElementById('validationCustom08').value;

    // Check if any of the required fields are empty
    // if (!fullName || !age || !city || !bloodAmount || !bloodType || !hospital || !gender || !date ) {
    //     displayMessageAboveForm('Error: Please fill in all required fields.', 'danger');
    //     return; // Prevent further execution
    // }

    // Check if the hospital is "Hospital A"
    if (hospital !== 'Hospital A') {
        displayMessageAboveForm('Error: Cannot submit form for ' + hospital, 'danger');
        return; // Prevent further execution
    }

   
  
    // Create a JavaScript object with form data
    const formData = {
        fullName: fullName,
        age: age,
        city: city,
        bloodAmount: bloodAmount,
        bloodType: bloodType,
        hospital: hospital,
        gender: gender,
        date: date,
        // Add other form fields using the same pattern
    };
    let token= localStorage.getItem('token');
    // Make a POST request to your REST API endpoint
    fetch('https://aliragab752001-b5a2994d54c4.herokuapp.com/api/addPatiant', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            displayMessageAboveForm('Form Submitted Successfully', 'success');
            
            // Reset form fields to empty
            document.getElementById('myForm').reset();
            
            // Handle success (e.g., show a success message to the user)
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessageAboveForm('Error submitting form. Please try again later.', 'danger');
            // Handle error (e.g., show an error message to the user)
        });
});

// Function to display a message above the form
function displayMessageAboveForm(message, type) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.appendChild(document.createTextNode(message));

    // Append the alert above the form
    document.getElementById('myForm').insertAdjacentElement('beforebegin', alertElement);

    // Automatically remove the alert after a certain time (e.g., 3 seconds)
    setTimeout(() => {
        alertElement.remove();
    }, 4000);
}
