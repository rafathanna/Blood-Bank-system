let buffer3 = [];

async function getData3() {
    let api = await fetch('', { method: 'GET' });
    let data = await api.json();
    buffer3 = data;
    console.log(buffer3);
    show3();
}

getData3();

function show3() {
    const tableBody = document.querySelector('tbody');
    let tableRows = '';

    let totalDonors = 0;
    let totalBloodAmount = 0;

    buffer3.forEach((item, index) => {
        totalDonors++;
        totalBloodAmount += buffer3[index].bloodAmount;

        // Update blood amount by blood type
        const bloodType = buffer3[index].bloodType;
        bloodAmountByType[bloodType] = (bloodAmountByType[bloodType] || 0) + buffer3[index].bloodAmount;
        tableRows += `
        <tr id="row-${index}">
            <td>#${index + 1}</td>
            <td>${buffer3[index].fullName}</td>
            <td>${buffer3[index].age}</td>
            <td>${buffer3[index].city}</td>
            <td>${buffer3[index].bloodAmount}</td>
            <td>${buffer3[index].bloodType}</td>
            <td>${buffer3[index].hospital}</td>
            <td>${buffer3[index].gender}</td>
            <td>${buffer3[index].date}</td>
            <td>
                <div class="btn-group">
                <button type="button" class="btn btn-outline-danger btn-sm d-flex flex-center" onclick="handleDeleteC(${index})">Delete</button>
                <button class="btn btn-outline-primary btn-sm d-flex flex-center" type="button" id="updateButton">Update</button>
            </div>
                </div>
            </td>
        </tr>
        `;
     
        

    });
    async function calc(){
    const donorNumberElement = document.getElementById('patientNumberc');
    const bloodAmountElement = document.getElementById('patientAmountc');
    donorNumberElement.textContent = `${totalDonors} patient`;
    console.log(totalDonors);
    bloodAmountElement.textContent = `${totalBloodAmount.toFixed()} l/mm blood`;
    console.log(totalBloodAmount);


    // Display blood amount for each blood type in the card
    const bloodTypeContainer = document.getElementById('patientTypeContainerC');
    bloodTypeContainer.innerHTML = ''; // Clear previous content

    for (const [bloodType, amount] of Object.entries(bloodAmountByType)) {
        const bloodTypeDiv = document.createElement('div');
        bloodTypeDiv.textContent = `Blood Type ${bloodType}: ${amount.toFixed()} l/mm blood`;
        bloodTypeContainer.appendChild(bloodTypeDiv);
    }
    }

   calc()

    // Update values in the card

    tableBody.innerHTML = tableRows;
}


//*************************************
//Delete API.......
//*************************************
async function patienthandleDeleteC(index) {
    try {
        const response = await fetch('https://dummyjson.com/products/1', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id:buffer3[index].id }), // Adjust based on your API requirements
        });

        if (response.ok) {
            // Remove the deleted item from the buffer array
            buffer3.splice(index, 1);
            // Update the displayed data
            show3();
        } else {
            console.error('Failed to delete the item.');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}
