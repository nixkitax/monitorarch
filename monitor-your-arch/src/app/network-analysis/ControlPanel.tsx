import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  sniffing: boolean;
  handleStart: () => void;
  handleStop: () => void;
  handleReset: () => void;
  handleExportCSV: () => void;
  dataAvailable: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  sniffing,
  handleStart,
  handleStop,
  handleReset,
  handleExportCSV,
  dataAvailable,
}) => {
  return (
    <div className="flex justify-center gap-3 py-5">
      <Button onClick={handleStart} disabled={sniffing}>
        Start Sniffing
      </Button>
      <Button onClick={handleStop} disabled={!sniffing}>
        Stop Sniffing
      </Button>
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
