"use client";
import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  sniffing: boolean;
  handleStartSniffing: () => void;
  handleStopSniffing: () => void;
  dataAvailable: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  sniffing,
  handleStartSniffing,
  handleStopSniffing,
  dataAvailable,
}) => {
  return (
    <div className="flex justify-center gap-3 py-5">
          <Button variant="outline" onClick={handleStartSniffing}>Start Sniffing</Button>
          <Button variant="outline" onClick={handleStopSniffing}>Stop Sniffing</Button>
    </div>
  );
};

export default ControlPanel;
