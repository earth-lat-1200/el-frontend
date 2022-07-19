function createTemperatureChart(labels,datapoints,canvasName) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'Grieskirchen',
            data: datapoints,
            borderColor: '#4fb3ff',
            fill: false,
            tension: 0.5
        }
        ]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sample Data'
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Uhrzeit'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperatur'
                    },
                    min: 0,
                    max: 200
                }
            }
        },
    };
    new Chart(canvasName,config)
}
