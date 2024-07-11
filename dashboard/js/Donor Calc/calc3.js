let buffers = [];

async function getData() {
  try {
    let token = localStorage.getItem('token');
    
    // Fetch data from the first API
    let api1 = await fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/getDonorHospitalC', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    let data1 = await api1.json();
    buffers.push({ data: data1.data.bloodAmounts, targetId: 'bloodAmountC' });

    // Fetch data from the second API
 

    // Once all data is fetched, call the show function
    show();
  } catch (error) {
    console.error('Error:', error);
    // Handle errors, e.g., display an error message to the user
  }
}

getData();

function show() {
  // Loop through each item in the buffers array
  for (let i = 0; i < buffers.length; i++) {
    const { data, targetId } = buffers[i];
    const targetElement = document.getElementById(targetId);
    let content = '';

    // Loop through each blood amount object in the data array
    for (let j = 0; j < data.length; j++) {
      const item = data[j];
      
      // Display blood type and total amount
      content += `${item.bloodType}: ${item.totalAmount} ml`;

      // Add a line break after each blood type and amount
      content += '<br>';
    }
    
    // Update the content of the target element with all blood types and amounts
    targetElement.innerHTML = content;
  } 
}
