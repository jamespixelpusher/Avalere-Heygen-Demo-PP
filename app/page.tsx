"use client";

import Link from "next/link";

export default function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Link
        href="/chat"
        className="px-6 py-3 rounded-md bg-white text-black font-medium"
      >
        Start
      </Link>
    </div>
  );
}
