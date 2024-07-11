
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
  buffer = data.data.expiredBlood;
  console.log(data.data);
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
                    <td>${buffer[index].date}</td>
                    <td>${buffer[index].phoneNumber}</td>
                </tr>
                `;
                  
  });


 

 tableBody.innerHTML = tableRows;

}





