

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
const totalDonors = localStorage.getItem('totalDonors');
const totalDonorB = localStorage.getItem('totalDonorsB');
const totalDonorC = localStorage.getItem('totalDonorsC');


// Pie Chart Example

var ctx = document.getElementById("myPieChart");

var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ["Hospital A [Donor]","Hospital B [Donor]","Hospital C[Donor]", "Hospital A[patient]","Hospital B[patient]","Hospital C[patient]"],
    datasets: [{
      data: [totalDonors,totalDonorB,totalDonorC,totalDonorB,totalDonorB,totalDonorB],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc','#4e73df', '#1cc88a', '#36b9cc','#4e73df', '#1cc88a'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors:true,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});
