// EXPORT SALES REPORT TO EXCEL
function exportToExcel() {

  const table = document.getElementById('salesReportTable');
  const ws = XLSX.utils.table_to_sheet(table);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, 'SalesReport.xlsx');
}

function exportToPDF() {
  // Create a new jsPDF instance
  const pdf = new window.jspdf.jsPDF();

  // Get the table data
  const table = document.getElementById('your-table-id'); // Replace 'your-table-id' with the actual ID of your table

  // Convert the table to a PDF using jspdf-autotable
  window.jspdf.jsPDF.autoTable(pdf, { html: table });

  // Save the PDF
  pdf.save('exported_data.pdf');
}






document.addEventListener('DOMContentLoaded', function () {

    let saleData = document.getElementById('salesReportDiagram').value;
    saleData = JSON.parse(saleData) 

    const labels = saleData.map(item => item._id); // Update with the actual property of your sales data
    const values = saleData.map(item => item.totalPercentage); // Update with the actual property of your sales data



    var areaData = {
      labels: [...labels], // Initial empty array
      datasets: [{
        label: '# of Sales',
        data: [...values], // Initial empty array
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      }]
    };

    var areaOptions = {
        plugins: {
          filler: {
            propagate: true
          }
        },
        scales: {
          yAxes: [{
            ticks: {
                suggestedMin: 2, // Set your desired starting value here
                callback: function(value, index, values) {
                  return value; // You can customize the callback as needed
                }
              },
            gridLines: {
              color: "rgb(204, 204, 204)"
            }
          }],
          xAxes: [{
            gridLines: {
              color: "rgb(204, 204, 204)"
            }
          }]
        }
      }

    // Check if the chart canvas element exists
    var areaChartCanvas = document.getElementById('areaChart');

    if (areaChartCanvas) {
      var areaChart = new Chart(areaChartCanvas.getContext('2d'), {
        type: 'line',
        data: areaData,
        options: areaOptions
      });
    }
  });

  

