function createBarChart(dataPoints, canvas, title) {
    const labels = [''];
    const data = {
        labels: labels,
        datasets: dataPoints.map((item, index) => {
            const hideDataset = item.name !== currentStationName
            const color = chartColors[index]
            return {
                label: item.name,
                data: labels.map(() => {
                    return [(item.start - HOUR_CONVERTER) * MILLIS_CONVERTER, (item.end - HOUR_CONVERTER) * MILLIS_CONVERTER];
                }),
                backgroundColor: [
                    `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`,
                ],
                borderColor: [
                    `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                ],
                borderWidth: 1,
                borderSkipped: false,
                hidden: hideDataset
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
                    beginAtZero: true,
                    grid: {
                        color: 'rgb(255, 255, 255, 0.4)'
                    }
                },
                x: {
                    ticks: {
                        beginAtZero: true
                    },
                    min: '1970-01-01 00:00:00',
                    max: '1970-01-02 00:00:00',
                    display: true,
                    title: {
                        display: true,
                        text: "Uhrzeit"
                    },
                    type: 'time',
                    grid: {
                        color: 'rgb(255, 255, 255, 0.4)'
                    }
                },
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            return context[0].dataset.label
                        },
                        label: function (context) {
                            const barData = context.dataset.data[0]
                            const startSeconds = (barData[0]) / MILLIS_CONVERTER
                            const endSeconds = (barData[1]) / MILLIS_CONVERTER
                            const startTimeString = formatSeconds(startSeconds + HOUR_CONVERTER)
                            const endTimeString = formatSeconds(endSeconds + HOUR_CONVERTER)
                            let label = `${startTimeString}-${endTimeString}`
                            return label;
                        }
                    }
                },
                legend: {
                    labels: {
                        font: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        },
    };

    return new Chart(canvas, config)
}
