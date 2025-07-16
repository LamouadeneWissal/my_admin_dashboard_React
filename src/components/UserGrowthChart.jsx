import React from 'react';
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
import { Line } from 'react-chartjs-2';

/**
 * Register required Chart.js components
 * These registrations enable the specific chart features we need:
 * - CategoryScale: For displaying categories on x-axis (months)
 * - LinearScale: For displaying numeric values on y-axis (user counts)
 * - PointElement: For displaying data points
 * - LineElement: For displaying lines connecting data points
 * - Title: For chart titles
 * - Tooltip: For interactive data tooltips
 * - Legend: For chart legend
 * - Filler: For area filling below the line
 */
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

/**
 * UserGrowthChart Component
 * 
 * Displays a line chart showing user growth metrics over time.
 * Uses Chart.js and react-chartjs-2 for rendering beautiful, responsive charts.
 * The component includes two datasets - active users and total users.
 * 
 * @returns {JSX.Element} - Rendered line chart component
 */
const UserGrowthChart = () => {
  /**
   * Chart configuration options
   * - responsive: Makes the chart resize with its container
   * - maintainAspectRatio: Allows the chart to adjust height
   * - Custom styling for legend, tooltips, axes, and data points
   */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          color: '#64748b'
        }
      },
      tooltip: {
        // Modern tooltip styling
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        displayColors: true,
        callbacks: {
          label: function(context) {
            return ' ' + context.dataset.label + ': ' + context.parsed.y;
          }
        }
      }
    },
    scales: {
      x: {
        // X-axis (horizontal) configuration
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#94a3b8',
          padding: 8
        }
      },
      y: {
        // Y-axis (vertical) configuration
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#94a3b8',
          padding: 10,
          callback: function(value) {
            return value > 0 ? value : '';
          }
        }
      },
    },
    elements: {
      // Enhanced styling for line and points
      line: {
        tension: 0.4, // Smooth curve to the line
        borderWidth: 3, // Thicker lines for better visibility
        capBezierPoints: true
      },
      point: {
        radius: 0, // Hide points by default for cleaner look
        hoverRadius: 6, // Show on hover
        hitRadius: 8, // Larger hit area for better UX
        hoverBorderWidth: 2
      }
    },
    // Add smooth animation
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  /**
   * Chart data
   * - labels: Months of the year for the x-axis
   * - datasets: Array of data series (active users and total registered users)
   * 
   * Note: This is sample data. In a production app, this would come from an API
   */
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Active Users',
        data: [123, 135, 148, 167, 185, 210, 236, 255, 290, 310, 325, 340],
        borderColor: '#3b82f6', // Modern blue
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
          return gradient;
        },
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#3b82f6',
        pointHoverBorderWidth: 2,
        borderWidth: 3,
      },
      {
        label: 'New Signups',
        data: [25, 30, 28, 32, 39, 45, 50, 48, 52, 55, 58, 62],
        borderColor: '#10b981', // Modern green
        backgroundColor: 'transparent',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#10b981',
        pointHoverBorderWidth: 2,
        borderWidth: 3,
      }
    ],
  };

  /**
   * Render the Line chart component
   * The Line component from react-chartjs-2 takes:
   * - options: The configuration object defined above
   * - data: The datasets and labels defined above
   * 
   * Chart.js handles responsiveness, tooltips, and animations automatically
   */
  return <Line options={options} data={data} />;
};

export default UserGrowthChart;
