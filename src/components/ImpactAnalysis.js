import React from 'react';
import PropTypes from 'prop-types';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ImpactAnalysis.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ImpactAnalysis = ({ impactData }) => {
  if (!impactData) return null;

  const { title, description, metrics = [], timeline = [], charts = [] } = impactData;

  if (!title || !description) return null;

  return (
    <div className="impact-analysis">
      <h2>{title}</h2>
      <div className="impact-description">
        <p>{description}</p>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <h3>{metric.label}</h3>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-change" style={{ 
              color: metric.change > 0 ? '#28a745' : '#dc3545'
            }}>
              {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
            </div>
          </div>
        ))}
      </div>

      <div className="charts-container">
        {charts.map((chart, index) => (
          <div key={index} className="chart-wrapper">
            <h3>{chart.title}</h3>
            {chart.type === 'line' ? (
              <Line data={chart.data} options={chart.options} />
            ) : (
              <Bar data={chart.data} options={chart.options} />
            )}
          </div>
        ))}
      </div>

      <div className="timeline">
        <h3>Impact Timeline</h3>
        {timeline.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-date">{event.date}</div>
            <div className="timeline-content">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ImpactAnalysis.propTypes = {
  impactData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    metrics: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        change: PropTypes.number.isRequired,
      })
    ),
    timeline: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ),
    charts: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['line', 'bar']).isRequired,
        data: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired,
      })
    ),
  }),
};

export default ImpactAnalysis; 