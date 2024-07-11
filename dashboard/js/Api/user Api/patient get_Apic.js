
let buffer=[]
let token= localStorage.getItem('token');
async function getdata() {
  let api = await fetch('https://ali-ragab-c865e3a7eb37.herokuapp.com/api/getPatientC',{
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  let data = await api.json();
  buffer = data.data.patient;
  console.log(data.data);
  showA();
  
}

getdata();

function showA() {
  const tableBody = document.querySelector('tbody');
  let tableRows = '';
  buffer.forEach((item, index) => {

    tableRows += `
        <tr id="row-${index}">
            <td>#${index + 1}</td>
            <td>${buffer[index].bloodAmount}</td>
            <td>${buffer[index].bloodType}</td>
            <td>${buffer[index].hospital}</td>
            <td>26 street Bns Station</td>
           
        </tr>
        `;
  });


  tableBody.innerHTML = tableRows;
}
