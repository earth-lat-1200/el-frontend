function createTemperatureChart(datapoints, canvas, title, chartColors, yAxisDescription) {
    const data = {
        datasets: datapoints.map((item, index) => {
            const hideDataset = !(item.name === currentStationName)
            const color = chartColors[index];
            return {
                label: item.name,
                data: item.values,
                borderColor: `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
                pointBackgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                pointRadius: 4,
                fill: false,
                tension: 0.5,
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
                            return context[0].dataset.label
                        },
                        label: function (context) {//TODO the description of the datapoint should vary in different types of charts
                            const secondsSinceMidnight = (context.parsed.x + (hourOffset * millisConverter)) / millisConverter
                            const timeString = formatSeconds(secondsSinceMidnight)
                            const temperature = context.parsed.y
                            return `${timeString}: ${temperature} C°`
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
                    min: -10,
                    max: 50,
                    grid: {
                        color: 'rgb(255, 255, 255, 0.4)'
                    }
                }
            }
        },
    };
    return new Chart(canvas, config)
}
