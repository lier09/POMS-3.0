import React, { useEffect, useRef } from 'react';
import type { PsqiScoreData, PsqiComponentScores } from '../types';
import Chart from 'chart.js/auto';

interface ResultsChartsProps {
  data: PsqiScoreData[];
}

const componentLabels = [
    'Sleep Quality', 'Sleep Latency', 'Sleep Duration', 'Sleep Efficiency', 
    'Disturbances', 'Medication', 'Daytime Dysfunction'
];

const getScoreColor = (score: number) => {
    if (score <= 5) return 'rgba(22, 163, 74, 0.6)'; // Green
    if (score <= 10) return 'rgba(234, 179, 8, 0.6)'; // Yellow
    return 'rgba(220, 38, 38, 0.6)'; // Red
};
const getScoreBorderColor = (score: number) => {
    if (score <= 5) return 'rgba(22, 163, 74, 1)';
    if (score <= 10) return 'rgba(234, 179, 8, 1)';
    return 'rgba(220, 38, 38, 1)';
};


const ResultsCharts: React.FC<ResultsChartsProps> = ({ data }) => {
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const radarChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<{ bar?: Chart, radar?: Chart }>({});

  useEffect(() => {
    // Cleanup previous charts
    if (chartInstances.current.bar) chartInstances.current.bar.destroy();
    if (chartInstances.current.radar) chartInstances.current.radar.destroy();

    if (barChartRef.current && data.length > 0) {
      const barCtx = barChartRef.current.getContext('2d');
      if (barCtx) {
        chartInstances.current.bar = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: data.map(d => d.name),
            datasets: [{
              label: 'Total PSQI Score',
              data: data.map(d => d.totalScore),
              backgroundColor: data.map(d => getScoreColor(d.totalScore)),
              borderColor: data.map(d => getScoreBorderColor(d.totalScore)),
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 21 } },
            plugins: { legend: { display: false }, title: { display: true, text: 'Total Score Comparison' } },
          },
        });
      }
    }
    
    if (radarChartRef.current && data.length > 0) {
       const radarCtx = radarChartRef.current.getContext('2d');
       if (radarCtx) {
           const numParticipants = data.length;
           const componentSums: PsqiComponentScores = data.reduce((acc, curr) => {
               Object.keys(acc).forEach(key => {
                   (acc as any)[key] += curr.scores[key as keyof PsqiComponentScores];
               });
               return acc;
           }, { c1_sleepQuality: 0, c2_sleepLatency: 0, c3_sleepDuration: 0, c4_sleepEfficiency: 0, c5_sleepDisturbances: 0, c6_useOfMedication: 0, c7_daytimeDysfunction: 0 });
            
           const componentAverages = Object.values(componentSums).map(sum => sum / numParticipants);

           chartInstances.current.radar = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: componentLabels,
                    datasets: [{
                        label: 'Average Score',
                        data: componentAverages,
                        fill: true,
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { r: { beginAtZero: true, max: 3, pointLabels: { font: { size: 10 } } } },
                    plugins: { legend: { display: false }, title: { display: true, text: 'Average Component Scores' } },
                }
           });
       }
    }
    
    return () => {
        if (chartInstances.current.bar) chartInstances.current.bar.destroy();
        if (chartInstances.current.radar) chartInstances.current.radar.destroy();
    };

  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-4 border rounded-lg bg-white shadow-sm" style={{height: '350px'}}>
             <canvas ref={barChartRef}></canvas>
        </div>
        <div className="p-4 border rounded-lg bg-white shadow-sm" style={{height: '350px'}}>
            <canvas ref={radarChartRef}></canvas>
        </div>
    </div>
  );
};

export default ResultsCharts;