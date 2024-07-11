
let buffer = [];
let token= localStorage.getItem('token');
async function getData() {
  let api = await fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/getDonorHospitalA',{
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  let data = await api.json();
  buffer = data.data.donorA;
  console.log(data.data);

// Check if blood type exists in any of the donors
let bloodTypeExists = false;
buffer.forEach((item) => {
  if (item.bloodType) {
    bloodTypeExists = true;
  }
});

// If blood type doesn't exist, create and show Bootstrap modal
if (!bloodTypeExists) {
  // Create modal element
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.id = 'bloodTypeModal';
  modal.tabIndex = '-1';
  modal.setAttribute('aria-labelledby', 'bloodTypeModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  // Modal dialog
  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog');
  modal.appendChild(modalDialog);

  // Modal content
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalDialog.appendChild(modalContent);

  // Modal header
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');
  modalContent.appendChild(modalHeader);

  const modalTitle = document.createElement('h5');
  modalTitle.classList.add('modal-title');
  modalTitle.id = 'bloodTypeModalLabel';
  modalTitle.textContent = 'Blood Type Missing';
  modalHeader.appendChild(modalTitle);

  const closeButton = document.createElement('button');
  closeButton.classList.add('btn-close');
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('data-bs-dismiss', 'modal');
  closeButton.setAttribute('aria-label', 'Close');
  modalHeader.appendChild(closeButton);

  // Modal body
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modalBody.textContent = 'Blood type information is missing in hospital A.';
  modalContent.appendChild(modalBody);

  // Modal footer
  const modalFooter = document.createElement('div');
  modalFooter.classList.add('modal-footer');
  modalContent.appendChild(modalFooter);

  const closeButtonFooter = document.createElement('button');
  closeButtonFooter.classList.add('btn', 'btn-secondary');
  closeButtonFooter.setAttribute('type', 'button');
  closeButtonFooter.setAttribute('data-bs-dismiss', 'modal');
  closeButtonFooter.textContent = 'Close';
  modalFooter.appendChild(closeButtonFooter);

  // Append modal to body
  document.body.appendChild(modal);

  // Show Bootstrap modal
  var bloodTypeModal = new bootstrap.Modal(document.getElementById('bloodTypeModal'));
  bloodTypeModal.show();
}


// pdfffffff
// Function to generate PDF from table




  show();
  
}

getData();
// Access the element on your website where you want to display the blood amount





function show() {
  
  const tableBody = document.querySelector('tbody');
  let tableRows = '';
  

  buffer.forEach((item, index) => {
 

    tableRows += `
                <tr id="row-${index}">
                    <td>#${index + 1}</td>
                    <td>${buffer[index].fullName}</td>
                    <td>${buffer[index].age}</td>
                    <td>${buffer[index].city}</td>
                    <td>${buffer[index].bloodAmount}</td>
                    <td>${buffer[index].bloodType}</td>
                    <td>${buffer[index].hospital}</td>
                    <td>${buffer[index].gender}</td>
                    <td class="text-white bg-secondary">${buffer[index].code}</td>
                    <td>${buffer[index].phoneNumber}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-outline-danger btn-sm d-flex flex-center" onclick="handleDelete(${index})" id="del">Delete</button>
                            <button class="btn btn-outline-primary btn-sm d-flex flex-center" type="button" onclick="handleUpdate(${index})" >Update</button>
                            
                
                        </div>
                    </td>
                </tr>
                `;
                  
  });


 

 tableBody.innerHTML = tableRows;

}


// Delete ******************************
async function handleDelete(index) {
  const deletedDonor = buffer[index];

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
      buffer.splice(index, 1);
      // Refresh the UI
      show();
    } else {
      console.error(`Failed to delete donor #${index + 1}`);
    }
  } catch (error) {
    console.error('Error deleting donor:', error);
  }
}

// Update*****************************
async function handleUpdate(index) {
  const donorData = buffer[index];

  const dataToSend = encodeURIComponent(JSON.stringify(donorData));

  window.location.href = `donor reqa.html?data=${dataToSend}`;
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
    const submitButton = document.getElementById('sub');
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
 
  try {
    const response = await fetch(`https://ali-ragab-c865e3a7eb37.herokuapp.com/api/updateDonorHospitalA/${donorId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData)
    });

    if (response.ok) {
      console.log(`Donor data updated successfully`);
      alert('Donor data updated successfully 😊');

      // Update buffer with the updated data
      const updatedDonorIndex = buffer.findIndex(donor => donor._id === donorId);
      if (updatedDonorIndex !== -1) {
        buffer[updatedDonorIndex] = updatedData;
      }

      // Refresh the UI
      show();
    } else {
      console.error(`Failed to update donor data`);
    }
  } catch (error) {
    console.error('Error updating donor data:', error);
  }
}




