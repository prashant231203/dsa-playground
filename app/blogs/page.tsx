"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
}

export default function BlogsPage() {
  const { user } = useAuth();
  const isAdmin = user && user.email === "admin@example.com";
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ title: string; content: string; author: string }>({ title: "", content: "", author: user?.username || "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [search, page]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
      if (search) params.append("search", search);
      const res = await fetch(`http://localhost:3000/api/blogs?${params.toString()}`);
      const data = await res.json();
      if (data.blogs) {
        setBlogs(data.blogs);
        setTotalPages(data.pagination?.pages || 1);
      } else if (Array.isArray(data)) {
        setBlogs(data);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setForm({ title: blog.title, content: blog.content, author: blog.author });
    setShowModal(true);
  };
  const handleAdd = () => {
    setEditingId(null);
    setForm({ title: "", content: "", author: user?.username || "" });
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ title: "", content: "", author: user?.username || "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/blogs/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Blog deleted");
      fetchBlogs();
    } else {
      toast.error(data.error || "Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.author) {
      toast.error("All fields are required.");
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `http://localhost:3000/api/blogs/${editingId}` : "http://localhost:3000/api/blogs";
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
      toast.success(editingId ? "Blog updated" : "Blog added");
      handleModalClose();
      fetchBlogs();
    } else {
      toast.error(data.error || "Failed to save");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Blogs</h1>
      <p className="text-xl text-slate-400 mb-8">Read and manage DSA-related blogs and articles.</p>
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <input
          className="w-full md:w-1/2 border p-2 rounded"
          placeholder="Search blogs by title or content..."
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
            {blogs.map(blog => (
              <Card key={blog.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{blog.title}</span>
                    {isAdmin && (
                      <span>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>Edit</Button>
                        <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(blog.id)}>Delete</Button>
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 whitespace-pre-line">{blog.content}</div>
                  <div className="mt-2 text-xs text-gray-500">By {blog.author}</div>
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
      {isAdmin && (
        <div className="mt-10">
          <Button onClick={handleAdd} className="mb-4">Add Blog</Button>
          <Dialog open={showModal} onOpenChange={open => { if (!open) handleModalClose(); }}>
            <DialogContent className="max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Blog" : "Add Blog"}</h2>
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
                  placeholder="Content"
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  required
                  rows={6}
                  disabled={submitting}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Author"
                  value={form.author}
                  onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
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