function createSendTimeChart(date, datapoints) {
    const labels = [''];
    const data = {
        labels: labels,
        datasets: datapoints.map(x=>{
            return {
                label: 'A',
                data: labels.map(()=>{
                    return [(x.start-hourOffset)*millisConverter, (x.end-hourOffset)*millisConverter];
                }),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                ],
                borderWidth: 1,
                borderSkipped: false
            }
        })
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks:{
                        beginAtZero: true
                    },
                    min: '1970-01-01 00:00:00',
                    max: '1970-01-02 00:00:00',
                    display: true,
                    title: {
                        display: true,
                        text: 'Uhrzeit'
                    },
                    type: 'time',
                },
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sendezeiten'
                },
                tooltip: {
                    callbacks: {
                        title: function (context){
                            return context[0].dataset.label
                        },
                        label: function(context) {
                            const barData = context.dataset.data[0]
                            const startSeconds = (barData[0])/millisConverter
                            const endSeconds = (barData[1])/millisConverter
                            const startTimeString = formatSeconds(startSeconds+hourOffset)
                            const endTimeString = formatSeconds(endSeconds+hourOffset)
                            let label = `${startTimeString}-${endTimeString}`
                            return label;
                        }
                    }
                }
            }
        },
    };

    new Chart("sendTimeChart", config)
}

// function getDateForXAxis(date, isEndDate){//the chart-library doesn't care about the date, so this seems unnecessary
//     date.setDate(date.getDate()+isEndDate)
//     const formatedDate = `${date.toISOString().substring(0,10)} 00:00:00`;
//     return formatedDate
// }

function formatSeconds(seconds){
    return new Date(millisConverter * seconds).toISOString().substring(11,16)
}
