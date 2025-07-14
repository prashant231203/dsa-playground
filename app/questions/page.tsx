"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Questions</h1>
      <ul className="space-y-4">
        {questions.map((q: any) => (
          <li key={q.id} className="border-b pb-2">
            <Link href={`/questions/${q.id}`} className="text-blue-500 hover:underline text-xl">
              {q.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 