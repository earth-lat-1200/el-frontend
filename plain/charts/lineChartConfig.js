function createLineChart(dataPoints, canvas, title, yAxisDescription) {
    const data = {
        datasets: dataPoints.map((item, index) => {
            const hideDataset = item.name !== currentStationName
            const color = chartColors[index];
            return {
                label: item.name,
                data: item.values.map((dataPoint, innerIndex)=>{
                    return {
                        y: dataPoint,
                        x: formatChartDate(innerIndex)
                    }
                }),
                borderColor: `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
                pointBackgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                pointRadius: 4,
                fill: false,
                tension: 0.0,
                borderWidth: 2,
                hidden: hideDataset
            }
        })
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            const secondsSinceMidnight = (context[0].parsed.x + (HOUR_CONVERTER * MILLIS_CONVERTER)) / MILLIS_CONVERTER
                            const time = formatSeconds(secondsSinceMidnight)
                            return time
                        },
                        label: function (context) {//TODO the description of the datapoint should vary in different types of charts
                            const stationName = context.dataset.label
                            const temperature = context.parsed.y
                            return ` ${stationName}: ${temperature} C°`
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    ticks: {
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
                    grid: {
                        color: 'rgb(255, 255, 255, 0.4)'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: yAxisDescription
                    },
                    min: 0,
                    max: 70,
                    grid: {
                        color: 'rgb(255, 255, 255, 0.4)'
                    }
                }
            }
        },
    };
    return new Chart(canvas, config)
}
