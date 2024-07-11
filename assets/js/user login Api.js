function showSuccessMessage(message) {
  const alertElement = document.createElement('div');
  alertElement.className = 'alert alert-success';
  alertElement.textContent = message;
  document.getElementById('alertContainer').appendChild(alertElement);
  setTimeout(() => {
    alertElement.remove();
  }, 5000); // Remove the alert after 5 seconds
}

function showErrorMessage(message) {
  const alertElement = document.createElement('div');
  alertElement.className = 'alert alert-danger';
  alertElement.textContent = message;
  document.getElementById('alertContainer').appendChild(alertElement);
  setTimeout(() => {
    alertElement.remove();
  }, 5000); // Remove the alert after 5 seconds
}




// Sign Up Form Submission
document.getElementById('signupForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const fullName = document.getElementById('username02').value;
  const email = document.getElementById('email02').value;
  const password = document.getElementById('password02').value;

  const formData = {
    fullName: fullName,
    email: email,
    password: password
  };

  fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  
      if (data.success) {
        showSuccessMessage(data.message);
     
    } else {
      showErrorMessage(data.message);
    }
})
  .catch(error => {
    console.error('Error:', error);
    showErrorMessage('Registration failed. Please try again.');
  });
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const apiUrl = 'https://ali-ragab-c865e3a7eb37.herokuapp.com/api/signin';

  fetch(apiUrl,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
      }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Login failed');
      }
      return response.json();
  })
  .then(data => {
      console.log(data);
      const role = data.data.role;
      const userEmail = data.data.email;
      let redirectUrl;

      const token = data.data.token;

      localStorage.setItem('token', token);
      switch (role) {
          case 'USER':
              redirectUrl = 'dashboard/index.html';
              localStorage.setItem('userEmail', userEmail);
              break;
          case 'MANGER':
              redirectUrl = 'dashboard/hospitals display.html';
              localStorage.setItem('managerEmail', userEmail);
              break;
          case 'ADMIN1':
              redirectUrl = 'dashboard/hospitals display A.html';
              localStorage.setItem('admin1Email', userEmail);
              break;
         
              case 'ADMIN2':
                redirectUrl = 'dashboard/hospitals display B.html';
                localStorage.setItem('admin2Email', userEmail);
                break;

                case 'ADMIN3':
                  redirectUrl = 'dashboard/hospitals display C.html';
                  localStorage.setItem('admin3Email', userEmail);
                  break;
          default:
              alert(data.message);
              return;
      }

       // Show success message before redirecting
       showSuccessMessage('Login successful. Redirecting...');

       // Redirect after a delay
       setTimeout(() => {
         window.location.href = redirectUrl;
       }, 3000); // Delay of 2 seconds before redirecting
   })
  })
  .catch(error => {
      console.error('Error:', error);
      showErrorMessage('Login failed. Please try again.');
  });


