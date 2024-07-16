import { getOverviewSystem } from "@/lib/tauri";
import { useCallback } from "react";

export default function Home() {
  const systemName = useCallback(async () => {
    const system = await getOverviewSystem();
    console.log(system);
  }, []);

  return (
    <div className="mx-24 ">
      <h1 className="font-bold text-3xl">Overview </h1>
    </div>
  );
}
