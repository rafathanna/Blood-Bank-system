// Function to handle logout
async function logout() {
    let token=  localStorage.getItem('token')

        const response = await fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
        });
        console.log(response)
       
            const responseData = await response.json();
            

            if (!responseData.loggedIn) {
                
                localStorage.removeItem('token');
            console.log('donnnnne')
              window.location.href = '../login page.html';
            } else {
             
                console.error('Logout failed:', responseData.message);
                
                alert('Logout failed: ' + responseData.message);
            }
        }      
  // Example usage: Call logout function when logout button is clicked
  document.getElementById('logout').addEventListener('click', logout);