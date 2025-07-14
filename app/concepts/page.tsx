import React from "react";

export default function ConceptsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Concepts</h1>
      <p className="text-xl text-slate-400 mb-8">Explore core data structures and algorithms concepts here.</p>
      <ul className="space-y-4 text-lg">
        <li>Arrays</li>
        <li>Linked Lists</li>
        <li>Stacks &amp; Queues</li>
        <li>Trees</li>
        <li>Graphs</li>
        <li>Sorting &amp; Searching</li>
        <li>Dynamic Programming</li>
      </ul>
    </div>
  );
} 