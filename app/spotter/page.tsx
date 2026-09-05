import { Suspense } from "react";
import { SpotterView } from "./SpotterView";

export default function SpotterPage() {
  return (
    <Suspense>
      <SpotterView />
    </Suspense>
  );
}
