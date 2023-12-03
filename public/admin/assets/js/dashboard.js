(function($) {
  'use strict';
  $.fn.andSelf = function() {
    return this.addBack.apply(this, arguments);
  }
  $(function() {
    if ($("#currentBalanceCircle").length) {
      var bar = new ProgressBar.Circle(currentBalanceCircle, {
        color: '#000',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 12,
        trailWidth: 12,
        trailColor: '#0d0d0d',
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: { color: '#d53f3a', width: 12 },
        to: { color: '#d53f3a', width: 12 },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
      
          var value = Math.round(circle.value() * 100);
          circle.setText('');
      
        }
      });

      bar.text.style.fontSize = '1.5rem';
      bar.animate(0.4);  // Number from 0.0 to 1.0
    }
    if($('#audience-map').length) {
      $('#audience-map').vectorMap({
        map: 'world_mill_en',
        backgroundColor: 'transparent',
        panOnDrag: true,
        focusOn: {
          x: 0.5,
          y: 0.5,
          scale: 1,
          animate: true
        },
        series: {
          regions: [{
            scale: ['#3d3c3c', '#f2f2f2'],
            normalizeFunction: 'polynomial',
            values: {

              "BZ": 75.00,
              "US": 56.25,
              "AU": 15.45,
              "GB": 25.00,
              "RO": 10.25,
              "GE": 33.25
            }
          }]
        }
      });
    }
    let totalRevenue = $('#totalRevenue-inWebsite').val();
    totalRevenue = $.parseJSON(totalRevenue)
    console.log(totalRevenue)
    if ($("#transaction-history").length) {
      var areaData = {
        labels: ["Online Payment", "Cash On Delivery", "Wallet"],
        datasets: [{
            data: [totalRevenue[0].percentageAmount,totalRevenue[1].percentageAmount,totalRevenue[2].percentageAmount],
            backgroundColor: [
              "#111111","#00d25b","#ffab00"
            ]
          }
        ]
      };



      var areaOptions = {
        responsive: true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        cutoutPercentage: 70,
        elements: {
          arc: {
              borderWidth: 0
          }
        },      
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
      var transactionhistoryChartPlugins = {
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
      
          ctx.restore();
          var fontSize = 1;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#000";
      
          var text =  `₹ ${totalRevenue[3].totalAmount}`, 
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2.4;
      
          ctx.fillText(text, textX, textY);

          ctx.restore();
          var fontSize = 0.75;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6c7293";

          var texts = "Total", 
              textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
              textsY = height / 1.7;
      
          ctx.fillText(texts, textsX, textsY);
          ctx.save();
        }
      }
      var transactionhistoryChartCanvas = $("#transaction-history").get(0).getContext("2d");
      var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
        type: 'doughnut',
        data: areaData,
        options: areaOptions,
        plugins: transactionhistoryChartPlugins
      });
    }


    if ($("#transaction-history-arabic").length) {
      var areaData = {
        labels: ["Paypal", "Stripe","Cash"],
        datasets: [{
            data: [88,0, 10],
            backgroundColor: [
              "#111111","#00d25b","#ffab00"
            ]
          }
        ]
      };
      var areaOptions = {
        responsive: true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        cutoutPercentage: 70,
        elements: {
          arc: {
              borderWidth: 0
          }
        },      
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
      var transactionhistoryChartPlugins = {
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
      
          ctx.restore();
          var fontSize = 1;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";
      
          var text = "$1200", 
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2.4;
      
          ctx.fillText(text, textX, textY);

          ctx.restore();
          var fontSize = 0.75;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6c7293";

          var texts = "مجموع", 
              textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
              textsY = height / 1.7;
      
          ctx.fillText(texts, textsX, textsY);
          ctx.save();
        }
      }
      var transactionhistoryChartCanvas = $("#transaction-history-arabic").get(0).getContext("2d");
      var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
        type: 'doughnut',
        data: areaData,
        options: areaOptions,
        plugins: transactionhistoryChartPlugins
      });
    }

    if ($('.owl-carousel').length) {
      $('.owl-carousel').each(function() {
        var isRtl = $("body").hasClass("rtl");
        var navIcons = ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"];

        $(this).owlCarousel({
          loop: true,
          margin: 10,
          dots: false,
          nav: true,
          rtl: isRtl,
          autoplay: true,
          autoplayTimeout: 4500,
          navText: isRtl ? [navIcons[1], navIcons[0]] : [navIcons[0], navIcons[1]],
          responsive: {
            0: {
              items: 1
            },
            600: {
              items: 1
            },
            1000: {
              items: 1
            }
          }
        });
      });
    }

  //   var areaData = {
  //     labels: ["2013", "2014", "2015", "2016", "2017"],
  //     datasets: [{
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(255, 206, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(255, 159, 64, 0.2)'
  //       ],
  //       borderColor: [
  //         'rgba(255,99,132,1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)',
  //         'rgba(255, 159, 64, 1)'
  //       ],
  //       borderWidth: 1,
  //       fill: true, // 3: no fill
  //     }]
  //   };
  
  //   var areaOptions = {
  //     plugins: {
  //       filler: {
  //         propagate: true
  //       }
  //     },
  //     scales: {
  //       yAxes: [{
  //         gridLines: {
  //           color: "rgb(204, 204, 204)"
  //         }
  //       }],
  //       xAxes: [{
  //         gridLines: {
  //           color: "rgb(204, 204, 204)"
  //         }
  //       }]
  //     }
  //   }
  
  

    
  // if ($("#areaChart").length) {
  //   var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
  //   var areaChart = new Chart(areaChartCanvas, {
  //     type: 'line',
  //     data: areaData,
  //     options: areaOptions
  //   });
  // }
    var isrtl = $("body").hasClass("rtl");
    if ($('.owl-carousel-rtl').length) {
      $('.owl-carousel-rtl').owlCarousel({
        loop: true,
        margin: 10,
        dots: false,
        nav: true,
        rtl: isrtl,
        autoplay: true,
        autoplayTimeout: 4500,
        navText: ["<i class='mdi mdi-chevron-right'></i>", "<i class='mdi mdi-chevron-left'></i>"],
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 1
          }
        }
      });
    }
    });
})(jQuery);

document.addEventListener('DOMContentLoaded', function () {

  let saleData = document.getElementById('salesReportDiagram').value;
  saleData = JSON.parse(saleData) 

  const labels = saleData.map(item => item.date); // Update with the actual property of your sales data
  const values = saleData.map(item => item.totalPercentage); // Update with the actual property of your sales data


  var areaData = {
    labels: labels,
    datasets: [{
      label: '# of Sales',
      data: values, // Initial empty array
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
  var areaChartCanvas = document.getElementById('salesChart');

  if (areaChartCanvas) {
    var areaChart = new Chart(areaChartCanvas.getContext('2d'), {
      type: 'line',
      data: areaData,
      options: areaOptions
    });
  }

  // CATEGORY BAR CHART
  let categoryReport = document.getElementById('categoryReport').value;
  categoryReport = JSON.parse(categoryReport) 

  const labelsCategory = categoryReport.map(item => item.categoryName); // Update with the actual property of your sales data
  const valuesCategory = categoryReport.map(item => item.totalPercentage); // Update with the actual property of your sales data


  // Sample data for the bar chart
  var barChartData = {
    labels: labelsCategory,
    datasets: [{
      label: 'Dataset 1',
      backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(153, 102, 255, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)', 'rgba(153, 102, 255, 1)'],
      borderWidth: 1,
      hoverBackgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(153, 102, 255, 0.5)'],
      data:valuesCategory
    }]
  };

  // Get the canvas element
  var ctx = document.getElementById('barChart').getContext('2d');

  // Create the bar chart
  var barChart = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      tooltips: {}, // Set tooltips to an empty object to remove the default tooltip
      legend: {
        display: false // Hide the legend
      },
      hover: {
        mode: null // Disable hover mode
      }
    }
  });

});

