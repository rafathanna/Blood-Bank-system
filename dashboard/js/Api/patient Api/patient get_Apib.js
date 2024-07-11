let buffer2 = [];

async function getData2() {
    let api = await fetch('http://localhost:3000/donors', { method: 'GET' });
    let data = await api.json();
    buffer2 = data;
    console.log(buffer2);
    show2();
}

getData2();

function show2() {
    const tableBody = document.querySelector('tbody');
    let tableRows = '';

    let totalDonors = 0;
    let totalBloodAmount = 0;
    let bloodAmountByType = {};

    buffer2.forEach((item, index) => {
        totalDonors++;
        totalBloodAmount += buffer2[index].bloodAmount;

        // Update blood amount by blood type
        const bloodType = buffer2[index].bloodType;
        bloodAmountByType[bloodType] = (bloodAmountByType[bloodType] || 0) + buffer2[index].bloodAmount;
        tableRows += `
        <tr id="row-${index}">
            <td>#${index + 1}</td>
            <td>${buffer2[index].fullName}</td>
            <td>${buffer2[index].age}</td>
            <td>${buffer2[index].city}</td>
            <td>${buffer2[index].bloodAmount}</td>
            <td>${buffer2[index].bloodType}</td>
            <td>${buffer2[index].hospital}</td>
            <td>${buffer2[index].gender}</td>
            <td>${buffer2[index].date}</td>
            <td>
                <div class="btn-group">
                <button type="button" class="btn btn-outline-danger btn-sm d-flex flex-center" onclick="patienthandleDeleteB(${index})">Delete</button>
                <button class="btn btn-outline-primary btn-sm d-flex flex-center" type="button" id="updateButton">Update</button>
            </div>
                </div>
            </td>
        </tr>
        `;
     
        

    });
    async function calc(){
    const donorNumberElement = document.getElementById('patientNumberb');
    const bloodAmountElement = document.getElementById('patientAmountb');
    donorNumberElement.textContent = `${totalDonors} patient`;
    console.log(totalDonors);
    bloodAmountElement.textContent = `${totalBloodAmount.toFixed()} l/mm`;
    console.log(totalBloodAmount);

    // Display blood amount for each blood type in the card
    const bloodTypeContainer = document.getElementById('patientTypeContainerB');
    bloodTypeContainer.innerHTML = ''; // Clear previous content

    for (const [bloodType, amount] of Object.entries(bloodAmountByType)) {
        const bloodTypeDiv = document.createElement('div');
       bloodTypeDiv.textContent = `${bloodType} (${amount.toFixed()} ml ) blood`;
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
async function patienthandleDeleteB(index) {
    try {
        const response = await fetch('https://dummyjson.com/products/1', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id:buffer2[index].id }), // Adjust based on your API requirements
        });

        if (response.ok) {
            // Remove the deleted item from the buffer array
            buffer2.splice(index, 1);
            // Update the displayed data
            show2();
        } else {
            console.error('Failed to delete the item.');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}
