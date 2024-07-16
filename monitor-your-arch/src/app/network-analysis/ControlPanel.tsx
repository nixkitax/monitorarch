"use client";
import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  sniffing: boolean;
  handleStartSniffing: () => void;
  handleStopSniffing: () => void;
  handleReset: () => void;
  handleExportCSV: () => void;
  dataAvailable: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  sniffing,
  handleStartSniffing,
  handleStopSniffing,
  handleReset,
  handleExportCSV,
  dataAvailable,
}) => {
  return (
    <div className="flex justify-center gap-3 py-5">
      <Button onClick={handleStartSniffing}>Start Sniffing</Button>
      <Button onClick={handleStopSniffing}>Stop Sniffing</Button>
      <Button onClick={handleReset} disabled={sniffing}>
        Reset Data
      </Button>
      <Button onClick={handleExportCSV} disabled={!dataAvailable}>
        Export as CSV
      </Button>
    </div>
  );
};

export default ControlPanel;
