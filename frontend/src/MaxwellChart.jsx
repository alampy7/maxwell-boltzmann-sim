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

    console.log('bin_center:', bin_centers.slice(0,5));
    console.log('f_teo:', f_teo.slice(0,5));

    const chartData = {
        labels: bin_centers.map((v) => v.toFixed(3)),
        datasets: [
            {
                label: 'Histograma (Monte Carlo)',
                data: hist_values,
                borderColor:'rgba(0, 153, 255, 1)',
                backgroundColor: 'rgba(0, 153, 255, 0.3)',
                fill: true,
            },
            {
                label: 'Distribución Maxwell-Boltzmann',
                data: bin_centers.map((v,i) => ({
                    x: v,
                    y: f_teo[i]
                })),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.4,
                parsing: false,
            }
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x :{
                type: 'linear',
                title: { display: true, text: 'Velocidad' },
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'f(v)' },
            },
        },
    };

    return (
        <div style={{marginTop: '2rem'}}>
            <Line data={chartData} options={options} />
        </div>
    );
}