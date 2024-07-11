
let bufferA=[]
let token= localStorage.getItem('token');
async function getDataA() {
  let api = await fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/getPatientA',{
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  let data = await api.json();
  bufferA = data.data.patient;
  console.log(data.data);
  showA();
  
}

getDataA();

function showA() {
  const tableBody = document.querySelector('tbody');
  let tableRows = '';
  bufferA.forEach((item, index) => {

    tableRows += `
        <tr id="row-${index}">
            <td>#${index + 1}</td>
            <td>${bufferA[index].fullName}</td>
            <td>${bufferA[index].age}</td>
            <td>${bufferA[index].city}</td>
            <td>${bufferA[index].bloodAmount}</td>
            <td>${bufferA[index].bloodType}</td>
            <td>${bufferA[index].hospital}</td>
            <td>${bufferA[index].gender}</td>
            <td>${bufferA[index].date}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-outline-danger btn-sm d-flex flex-center" onclick="patienthandleDelete(${index})">Delete</button>
                    <button class="btn btn-outline-primary btn-sm d-flex flex-center" type="button" id="updateButton">Update</button>
                    <button class="btn btn-outline-primary btn-sm d-flex flex-center" type="button" id="yourButtonId" onclick="subtractBloodAmount(${index})">approve request</button>
                </div>
            </td>
        </tr>
        `;
  });


  tableBody.innerHTML = tableRows;
}

// async function patienthandleDelete(index) {
//   const deletedDonor = bufferA[index];

//   try {
//     const response = await fetch(`https://blood-u754.onrender.com/patiantA/${deletedDonor._id}`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       console.log(`Donor #${index + 1} deleted successfully`);
//       buffer.splice(index, 1);
//       showA();
//       calc();
//     } else {
//       console.error(`Failed to delete donor #${index + 1}`);
//     }
//   } catch (error) {
//     console.error('Error deleting donor:', error);
//   }
// }



async function subtractBloodAmount(index, button) {
  const patientId = bufferA[index];
  try {
    const response = await fetch(`https://ali-ragab-c865e3a7eb37.herokuapp.com/api/getBloodHospitalA/${patientId._id}`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log(`Blood amount subtracted successfully for donor #${index + 1}`);
      
      // Add icon to indicate subtraction
      const icon = document.createElement('i');
      icon.classList.add('fas', 'fa-minus-circle'); // Font Awesome icon classes
      icon.style.color = '#ff6347'; // Set icon color
      icon.style.fontSize = '20px'; // Set icon color
      // Optionally, you can add more styles or attributes to the icon if needed
      
      // Get the table row
      const row = document.getElementById(`row-${index}`);
      
      // Create a new cell for the icon
      const cell = document.createElement('td');
      cell.appendChild(icon);
      
      // Insert the cell at the end of the row
      row.appendChild(cell);
      
      // Store information in local storage
      localStorage.setItem(`subtract`, '#ff6347');

      // Disable the button
      button.disabled = true;
    } else {
      console.error(`Failed to subtract blood amount for donor #${index + 1}`);
    }
  } catch (error) {
    console.error('Error subtracting blood amount:', error);
  }
}



