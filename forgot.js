document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the email value
    const email = document.getElementById('email').value;
    let token= localStorage.getItem('token');
    // Send the email to backend API
    fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/forgetPassword', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => {
      if (response.ok) {
        alert('Email sent successfully!');
        document.getElementById('email').value = ''; // Clear the email input
      } else {
        alert('Failed to send email. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to send email. Please try again later.');
    });
  });