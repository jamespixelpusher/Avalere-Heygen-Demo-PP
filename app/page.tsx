"use client";

import Link from "next/link";

export default function App() {
  return (
    <div className="relative w-screen h-screen">
      <Link href="/chat" className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "10%" }} aria-label="Start">
        <img src="/start_button.svg" alt="Start" />
      </Link>
    </div>
  );
}
