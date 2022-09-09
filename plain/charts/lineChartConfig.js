function createLineChart(dataPoints, canvas, title, description, min, max) {
    let axisType;
    if (max > NORMAL_LINE_CHART_END) {
        axisType = 'logarithmic'
    } else {
        axisType = 'linear'
    }

    const data = {
        datasets: dataPoints.map((item, index) => {

            const hideDataset = (item.name !== currentStationName) && (currentStationName !== '*')
            const color = chartColors[index];
            return {
                label: item.name,
                data: item.values.map((dataPoint, innerIndex) => {
                    const day = ((innerIndex / 24) | 0) + 1
                    return {
                        y: Math.round((dataPoint + Number.EPSILON) * 100) / 100,
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
                    text: title,
                    font: {
                        size: FONT_SIZE_TITLE
                    }
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
                    ticks: tickConfig,
                    min: formatChartDate(12 + getTimezoneOffsetHours(), 1),
                    max: formatChartDate(12 + getTimezoneOffsetHours(), 3),
                    display: true,
                    title: {
                        display: true,
                        text: 'local time',
                        font: {
                            size: FONT_SIZE_LABEL
                        }
                    },
                    type: 'time',
                    grid: {
                        color: gridConfig
                    }
                },
                y: {
                    type: axisType,
                    display: true,
                    title: {
                        display: true,
                        text: description,
                        font: {
                            size: FONT_SIZE_LABEL
                        }
                    },
                    min: min,
                    max: max,
                    grid: {
                        color: gridConfig
                    }
                }
            }
        },
    };
    return new Chart(canvas, config)
}
