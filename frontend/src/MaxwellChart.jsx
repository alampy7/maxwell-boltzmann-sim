import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    scales,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);

export default function MaxwellChart({ data }) {
    if (!data) return null;

    const { bin_centers, hist_values, v_teo, f_teo} = data;

    const chartData = {
        labels: bin_centers.map((v) => v.toFixed(3)),
        datasets: [
            {
                label: 'Histograma (empírico)',
                data: hist_values,
                borderColor:'rgba(0, 153, 255, 1)',
                backgroundColor: 'rgba(0, 153, 255, 0.3)',
                fill: true,
            },
            {
                label: 'Distribución teórica',
                data: f_teo.slice(0, bin_centers.length),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
            }
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{marginTop: '2rem'}}>
            <Line data={chartData} options={options} />
        </div>
    );
}