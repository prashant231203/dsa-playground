"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Concept {
  id: string;
  title: string;
  description: string;
}

export default function ConceptsPage() {
  const { user } = useAuth();
  const isAdmin = user && user.email === "admin@example.com";
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ title: string; description: string }>({ title: "", description: "" });
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/concepts");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch concepts");
      setConcepts(data.concepts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (concept: Concept) => {
    setEditingId(concept.id);
    setForm({ title: concept.title, description: concept.description });
    setShowModal(true);
  };
  const handleAdd = () => {
    setEditingId(null);
    setForm({ title: "", description: "" });
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ title: "", description: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this concept?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/concepts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Concept deleted");
      fetchConcepts();
    } else {
      toast.error(data.error || "Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("All fields are required.");
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `http://localhost:3000/api/concepts/${editingId}` : "http://localhost:3000/api/concepts";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      toast.success(editingId ? "Concept updated" : "Concept added");
      handleModalClose();
      fetchConcepts();
    } else {
      toast.error(data.error || "Failed to save");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Concepts</h1>
      <p className="text-xl text-slate-400 mb-8">Explore and manage core data structures and algorithms concepts.</p>
      {loading && <div className="p-6 text-center">Loading...</div>}
      {error && <div className="p-6 text-center text-red-500">{error}</div>}
      <div className="space-y-6">
        {concepts.map(concept => (
          <Card key={concept.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{concept.title}</span>
                {isAdmin && (
                  <span>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(concept)}>Edit</Button>
                    <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(concept.id)}>Delete</Button>
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{concept.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {isAdmin && (
        <div className="mt-10">
          <Button onClick={handleAdd} className="mb-4">Add Concept</Button>
          <Dialog open={showModal} onOpenChange={open => { if (!open) handleModalClose(); }}>
            <DialogContent className="max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Concept" : "Add Concept"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  disabled={submitting}
                />
                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                  disabled={submitting}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>{submitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update" : "Add")}</Button>
                  <Button type="button" variant="outline" onClick={handleModalClose} disabled={submitting}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
} 