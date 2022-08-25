function createLineChart(dataPoints, canvas, title, description) {
    const data = {
        datasets: dataPoints.map((item, index) => {
            const hideDataset = item.name !== currentStationName
            const color = chartColors[index];
            return {
                label: item.name,
                data: item.values.map((dataPoint, innerIndex) => {
                    const day = ((innerIndex / 24) | 0) + 1
                    return {
                        y: dataPoint,
                        x: formatChartDate(innerIndex % 24, day)
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
                            const millisecondsSinceStart = context[0].parsed.x
                            const time = getFormattedTooltipDate(millisecondsSinceStart)
                            return time
                        },
                        label: function (context) {
                            const stationName = context.dataset.label
                            const yValue = context.parsed.y
                            return ` ${stationName}: ${yValue} ${description}`
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
                    min: formatChartDate(12 + getTimezoneOffsetHours(), 1),
                    max: formatChartDate(12 + getTimezoneOffsetHours(), 3),
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
                        text: description
                    },
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgb(255, 255, 255, 0.4)'
                    }
                }
            }
        },
    };
    return new Chart(canvas, config)
}
