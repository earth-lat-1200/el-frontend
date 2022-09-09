function createBarChart(dataPoints, canvas, title) {
    const labels = [''];

    const data = {
        labels: labels,
        datasets: dataPoints.map((item, index) => {
            const hideDataset = (item.name !== currentStationName) && (currentStationName !== '*')
            const color = chartColors[index]
            return {
                label: item.name,
                data: labels.map(() => {
                    return [(item.start - HOUR_CONVERTER) * MILLIS_CONVERTER,
                        (item.end - HOUR_CONVERTER) * MILLIS_CONVERTER];
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
                        color: gridConfig
                    }
                },
                x: {
                    ticks: tickConfig,
                    min: formatChartDate(12 + getTimezoneOffsetHours(), 1),
                    max: formatChartDate(12 + getTimezoneOffsetHours(), 3),
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
            responsive: true,
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
                            const barData = context.dataset.data[0]
                            const startDateTimeString = getFormattedTooltipDate(barData[0])
                            const endDateTimeString = getFormattedTooltipDate(barData[1])
                            return [startDateTimeString, `-${endDateTimeString}`];
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
