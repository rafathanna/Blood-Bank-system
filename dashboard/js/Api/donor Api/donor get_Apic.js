let bufferC = [];
let token= localStorage.getItem('token');
async function getDataC() { 
   let api = await fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/getDonorHospitalC', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      }
  });
    let data = await api.json();
    bufferC = data.data.donorHospitalC;
    console.log(data.data);
    showC();
}

getDataC();

function showC() {
    const tableBody = document.querySelector('tbody');
    let tableRows = '';
  

    bufferC.forEach((item, index) => {
      
        tableRows += `
        <tr id="row-${index}">
            <td>#${index + 1}</td>
            <td>${bufferC[index].fullName}</td>
            <td>${bufferC[index].age}</td>
            <td>${bufferC[index].city}</td>
            <td>${bufferC[index].bloodAmount}</td>
            <td>${bufferC[index].bloodType}</td>
            <td>${bufferC[index].hospital}</td>
            <td>${bufferC[index].gender}</td>
            <td  class="text-white bg-secondary">${bufferC[index].code}</td>
            <td>${bufferC[index].phoneNumber}</td>
            <td>
                <div class="btn-group">
                <button type="button" class="btn btn-outline-danger btn-sm d-flex flex-center" onclick=" handleDeleteC(${index})">Delete</button>
                <button class="btn btn-outline-primary btn-sm d-flex flex-center" type="button" id="updateButton" onclick="handleUpdate(${index})">Update</button>
            </div>
                </div>
            </td>
        </tr>
        `;
     
        

    });
  

    // Update values in the card

    tableBody.innerHTML = tableRows;
}

//*************************************
//Delete API.......
//************************************ */ */
async function handleDeleteC(index) {
  const deletedDonor = bufferC[index];

  // Send a DELETE request to the server
  try {
    const response = await fetch(`https://ali-ragab-c865e3a7eb37.herokuapp.com/api/deleteDonorHospitalA/${deletedDonor._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log(`Donor #${index + 1} deleted successfully`);
      // Remove the deleted donor from the buffer
      bufferC.splice(index, 1);
      // Refresh the UI
      showC();
    } else {
      console.error(`Failed to delete donor #${index + 1}`);
    }
  } catch (error) {
    console.error('Error deleting donor:', error);
  }
}

//*************************************
//Update API.......
//************************************ */ */
async function handleUpdate(index) {
    const donorData = bufferC[index];
  
    const dataToSend = encodeURIComponent(JSON.stringify(donorData));
  
    window.location.href = `donor reqc.html?data=${dataToSend}`;
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('myForm');
  
    if (!form.hasEventListener) {
      const params = new URLSearchParams(window.location.search);
      const dataReceived = params.get('data');
  
      const donorData = JSON.parse(decodeURIComponent(dataReceived));
  
      document.getElementById('validationCustom01').value = donorData.fullName;
      document.getElementById('validationCustom02').value = donorData.age;
      document.getElementById('validationCustom03').value = donorData.city;
      document.getElementById('validationCustomamount').value = donorData.bloodAmount;
      document.getElementById('validationCustom05').value = donorData.bloodType;
      document.getElementById('validationCustom06').value = donorData.hospital;
      document.getElementById('validationCustom07').value = donorData.gender;
      document.getElementById('validationCustom08').value = donorData.date;
      document.getElementById('validationCustom09').value = donorData.haveDiseases;
      document.getElementById('validationCustom10').value =donorData.phoneNumber;
      const submitButton = document.getElementById('sub3');
      if (submitButton) {
        submitButton.remove();
      }
  
      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.id = 'update';
      updateButton.classList.add('btn', 'btn-primary');
      updateButton.addEventListener('click', async function (event) {
        event.preventDefault();
        await handleFormSubmit(donorData._id);
      });
  
      form.appendChild(updateButton);
      form.hasEventListener = true;
    }
  });
  
  async function handleFormSubmit(donorId) {
    const updatedData = {
      fullName: document.getElementById('validationCustom01').value,
      age: document.getElementById('validationCustom02').value,
      city: document.getElementById('validationCustom03').value,
      bloodAmount: document.getElementById('validationCustomamount').value,
      bloodType: document.getElementById('validationCustom05').value,
      hospital: document.getElementById('validationCustom06').value,
      gender: document.getElementById('validationCustom07').value,
      date: document.getElementById('validationCustom08').value,
      haveDiseases: document.getElementById('validationCustom09').value,
      phoneNumber: document.getElementById('validationCustom10').value,
    };
  
    await fetch(`https://ali-ragab-c865e3a7eb37.herokuapp.com/api/updateDonorHospitalC/${donorId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
      .then(response => {
        if (response.ok) {
          console.log(`Donor data updated successfully`);
          alert('Donor data updated successfully 😊');
        } else {
          console.error(`Failed to update donor data`);
        }
      })
      .catch(error => {
        console.error('Error updating donor data:', error);
      });
      
  }