"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function QuestionDetailPage() {
  const params = useParams();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/questions/${params.id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setQuestion(data);
        setLoading(false);
      });
  }, [params?.id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!question) return <div className="p-10 text-center text-red-500">Question not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
      <p className="text-lg text-slate-700 dark:text-slate-300">{question.body}</p>
    </div>
  );
} 