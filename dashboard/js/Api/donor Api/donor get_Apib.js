let bufferB = [];
let token= localStorage.getItem('token');
async function getDataB() {
    let api = await fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/getDonorHospitalB', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    let data = await api.json();
    bufferB = data.data.donorHospitalB;
    console.log(data.data);
    showB();
}

getDataB();

function showB() {
    const tableBody = document.querySelector('tbody');
    let tableRows = '';


    bufferB.forEach((item, index) => {
       

        tableRows += `
        <tr id="row-${index}">
            <td>#${index + 1}</td>
            <td>${bufferB[index].fullName}</td>
            <td>${bufferB[index].age}</td>
            <td>${bufferB[index].city}</td>
            <td>${bufferB[index].bloodAmount}</td>
            <td>${bufferB[index].bloodType}</td>
            <td>${bufferB[index].hospital}</td>
            <td>${bufferB[index].gender}</td>
            <td class="text-white bg-secondary">${bufferB[index].code}</td>
            <td>${bufferB[index].phoneNumber}</td>
            <td>
                <div class="btn-group">
                <button type="button" class="btn btn-outline-danger btn-sm d-flex flex-center" onclick="handleDeleteB(${index})">Delete</button>
                <button class="btn btn-outline-primary btn-sm d-flex flex-center" type="button" id="updateButton" onclick="handleUpdate(${index})">Update</button>
            </div>
                </div>
            </td>
        </tr>
        `;
     
        

    });
   


    tableBody.innerHTML = tableRows;
}
//*************************************
//Delete  API.......
//************************************ */ */
async function handleDeleteB(index) {
  const deletedDonor = bufferB[index];

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
      bufferB.splice(index, 1);
      // Refresh the UI
      showB();
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
    const donorData = bufferB[index];
  
    const dataToSend = encodeURIComponent(JSON.stringify(donorData));
  
    window.location.href = `donor reqb.html?data=${dataToSend}`;
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
      const submitButton = document.getElementById('sub2');
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
  
    await fetch(`https://ali-ragab-c865e3a7eb37.herokuapp.com/api/updateDonorHospitalB/${donorId}`, {
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