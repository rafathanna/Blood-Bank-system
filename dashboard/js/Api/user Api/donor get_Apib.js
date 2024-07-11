let buffer = [];

async function getData() {
    let token= localStorage.getItem('token');
     let api = await fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/getDonorHospitalB', {
       method: 'GET',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       }
     });
     let data = await api.json();
     buffer = data.data.donorHospitalB;
     console.log(data.data);
     show();
     
   }

getData();

function show() {
    const tableBody = document.querySelector('tbody');
    let tableRows = '';

    buffer.forEach((item, index) => {
      

        tableRows += `
        <tr>
            <td>#${index + 1}</td>
            <td>${buffer[index].bloodAmount}</td>
            <td>${buffer[index].bloodType}</td>
            <td>${buffer[index].hospital}</td>
            <td>${buffer[index].date}</td>
        </tr>
        `;
     
        

    });


    tableBody.innerHTML = tableRows;
}
