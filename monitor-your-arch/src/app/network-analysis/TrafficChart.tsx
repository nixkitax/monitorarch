import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface TrafficChartProps {
  trafficData: {
    upload: number[];
    download: number[];
    labels: string[];
  };
}

const TrafficChart: React.FC<TrafficChartProps> = ({ trafficData }) => {
  const data = {
    labels: trafficData.labels,
    datasets: [
      {
        label: "Upload (bytes)",
        data: trafficData.upload,
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Download (bytes)",
        data: trafficData.download,
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default TrafficChart;
