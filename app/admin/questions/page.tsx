"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  test_cases: any[];
  solution_template?: string;
}

export default function AdminQuestionsPage() {
  const { user } = useAuth();
  const isAdmin = user && user.email === "admin@example.com";
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Question>>({ title: "", description: "", difficulty: "Easy", category: "", test_cases: [], solution_template: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [testCasesInput, setTestCasesInput] = useState("[]");

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, [search, page]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
      if (search) params.append("search", search);
      const res = await fetch(`http://localhost:3000/api/questions?${params.toString()}`);
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setTotalPages(data.pagination?.pages || 1);
      } else if (Array.isArray(data)) {
        setQuestions(data);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({ ...q, test_cases: q.test_cases || [] });
    setTestCasesInput(JSON.stringify(q.test_cases || [], null, 2));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/admin/questions/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Question deleted");
      fetchQuestions();
    } else {
      toast.error(data.error || "Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!form.title || !form.description || !form.category || !form.difficulty) {
      toast.error("All fields are required.");
      return;
    }
    let testCases;
    try {
      testCases = JSON.parse(testCasesInput);
      if (!Array.isArray(testCases) || testCases.length === 0) throw new Error();
    } catch {
      toast.error("Test Cases must be a valid non-empty JSON array.");
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `http://localhost:3000/api/admin/questions/${editingId}` : "http://localhost:3000/api/admin/questions";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, test_cases: testCases }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      toast.success(editingId ? "Question updated" : "Question added");
      setEditingId(null);
      setForm({ title: "", description: "", difficulty: "Easy", category: "", test_cases: [], solution_template: "" });
      setTestCasesInput("[]");
      fetchQuestions();
    } else {
      toast.error(data.error || "Failed to save");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 bg-green-700 text-white flex flex-col py-8 px-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <a href="/admin/questions" className="font-semibold hover:bg-green-800 rounded px-3 py-2 transition">Questions</a>
          <a href="/blogs" className="font-semibold hover:bg-green-800 rounded px-3 py-2 transition">Blogs</a>
          <a href="/concepts" className="font-semibold hover:bg-green-800 rounded px-3 py-2 transition">Concepts</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 px-8 py-10">
        <div className="mb-10 border-b-4 border-green-600 pb-4 flex items-center gap-4">
          <h1 className="text-4xl font-bold text-green-700">Admin: Questions</h1>
        </div>
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <input
            className="w-full md:w-1/2 border p-2 rounded"
            placeholder="Search questions by title or description..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {error && <div className="p-6 text-center text-red-500">{error}</div>}
        {loading ? (
          <div className="space-y-4">
            {[...Array(perPage)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {questions.map(q => (
                <Card key={q.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{q.title}</span>
                      <span>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(q)}>Edit</Button>
                        <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(q.id)}>Delete</Button>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 mb-2">{q.description}</div>
                    <div className="text-xs text-gray-500">{q.difficulty} | {q.category}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <span className="px-3 py-2 text-sm">Page {page} of {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </>
        )}
        {(!loading && questions.length === 0) && (
          <div className="p-8 text-center text-slate-400">No questions found. Add your first question!</div>
        )}
        {isAdmin && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Question" : "Add Question"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border p-2 rounded"
              placeholder="Title"
              value={form.title || ""}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              disabled={submitting}
            />
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Description"
              value={form.description || ""}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
              disabled={submitting}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Category"
              value={form.category || ""}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              required
              disabled={submitting}
            />
            <select
              className="w-full border p-2 rounded"
              value={form.difficulty || "Easy"}
              onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
              required
              disabled={submitting}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <textarea
              className="w-full border p-2 rounded font-mono"
              placeholder="Test Cases (JSON array)"
              value={testCasesInput}
              onChange={e => setTestCasesInput(e.target.value)}
              required
              disabled={submitting}
              rows={4}
            />
            <textarea
              className="w-full border p-2 rounded font-mono"
              placeholder="Solution Template (optional)"
              value={form.solution_template || ""}
              onChange={e => setForm(f => ({ ...f, solution_template: e.target.value }))}
              disabled={submitting}
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>{submitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update" : "Add")}</Button>
              {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ title: "", description: "", difficulty: "Easy", category: "", test_cases: [], solution_template: "" }); }} disabled={submitting}>Cancel</Button>}
            </div>
          </form>
        </div>
        )}
      </main>
    </div>
  );
} 