import HomeComponent from "@/components/Home";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <HomeComponent />
    </Suspense>
  )
}