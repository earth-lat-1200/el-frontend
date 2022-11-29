function createBarChart(dataPoints, canvas, title) {
    const labels = [''];
    const data = {
        labels: labels,
        datasets: dataPoints.map((item, index) => {
            const hideDataset = (item.stationName !== currentStationName) && (currentStationName !== '*')
            const color = chartColors[index]
            return {
                label: item.stationName,
                data: item.values.map(value => {
                    return{
                        y:index,
                        x:[value.start, value.end]
                    }
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
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridConfig
                    }
                },
                x: {
                    ticks: tickConfig,
                    min: getFormattedDateTime(startReferenceDate),
                    max: getFormattedDateTime(endReferenceDate),
                    display: true,
                    title: {
                        display: true,
                        text: "local time",
                        font: {
                            size: FONT_SIZE_LABEL
                        }
                    },
                    type: 'time',
                    time: {
                        unit: 'hour'
                    },
                    grid: {
                        color: 'rgb(255, 255, 255, 0.4)'
                    }
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: FONT_SIZE_TITLE
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            return context[0].dataset.label
                        },
                        label: function (context) {
                            const barData = context.dataset.data[context.dataIndex].x
                            const date = getDateFromDate(barData[0])
                            const startTime = getTimeFromDate(barData[0])
                            const endTime = getTimeFromDate(barData[1])
                            return [date, startTime, endTime];
                        }
                    }
                },
                legend: {
                    labels: {
                        font: {
                            color: DEFAULT_FONT_COLOR
                        }
                    }
                }
            }
        },
    };

    return new Chart(canvas, config)
}