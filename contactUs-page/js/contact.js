const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

// api 
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data into an object
    const formData = {
      Username: form.elements['name'].value,
      Email: form.elements['email'].value,
      Phone: form.elements['phone'].value,
      Message: form.elements['message'].value
    };

    // Example endpoint URL (replace with your actual backend URL)
    const apiUrl = 'https://ali-ragab-c865e3a7eb37.herokuapp.com/api/contectUs'; // Adjust URL as needed

    // Send form data to the backend using fetch
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Expecting plain text response
    })
    .then(data => {
      console.log('Success:', data); // Log the text response from the backend
      // Optionally: show success message to user
      alert('Email has been sent!');
      form.reset(); // Reset form after successful submission
    })
    .catch(error => {
      console.error('Error:', error);
      // Optionally: show error message to user
      alert('There was an error sending your message.');
    });
  });
});
