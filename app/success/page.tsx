import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-500">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}