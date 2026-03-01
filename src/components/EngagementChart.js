'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function EngagementChart({ media }) {
    if (!media || media.length === 0) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)' }}>
                No data available
            </div>
        );
    }

    const sortedMedia = [...media].reverse();
    const labels = sortedMedia.map((m, i) => `Post ${i + 1}`);

    const data = {
        labels,
        datasets: [
            {
                label: 'Reach',
                data: sortedMedia.map(m => m.insights?.reach || 0),
                borderColor: '#833ab4',
                backgroundColor: 'rgba(131, 58, 180, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#833ab4',
                pointBorderColor: '#833ab4',
                pointRadius: 5,
                pointHoverRadius: 7,
            },
            {
                label: 'Engagement',
                data: sortedMedia.map(m => m.insights?.engagement || m.insights?.total_interactions || 0),
                borderColor: '#fd1d1d',
                backgroundColor: 'rgba(253, 29, 29, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fd1d1d',
                pointBorderColor: '#fd1d1d',
                pointRadius: 5,
                pointHoverRadius: 7,
            },
            {
                label: 'Plays',
                data: sortedMedia.map(m => m.insights?.plays || 0),
                borderColor: '#fcb045',
                backgroundColor: 'rgba(252, 176, 69, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fcb045',
                pointBorderColor: '#fcb045',
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#8e8ea0',
                    font: { family: 'Inter', size: 12 },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(18, 18, 26, 0.95)',
                titleColor: '#f0f0f5',
                bodyColor: '#8e8ea0',
                borderColor: 'rgba(255,255,255,0.06)',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 14,
                titleFont: { family: 'Inter', weight: '600' },
                bodyFont: { family: 'Inter' },
                callbacks: {
                    label: function (context) {
                        let value = context.parsed.y;
                        if (value >= 1000000) value = (value / 1000000).toFixed(1) + 'M';
                        else if (value >= 1000) value = (value / 1000).toFixed(1) + 'K';
                        return ` ${context.dataset.label}: ${value}`;
                    }
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255,255,255,0.03)',
                },
                ticks: {
                    color: '#5a5a6e',
                    font: { family: 'Inter', size: 11 },
                },
            },
            y: {
                grid: {
                    color: 'rgba(255,255,255,0.03)',
                },
                ticks: {
                    color: '#5a5a6e',
                    font: { family: 'Inter', size: 11 },
                    callback: function (value) {
                        if (value >= 1000000) return (value / 1000000).toFixed(0) + 'M';
                        if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                        return value;
                    },
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}
