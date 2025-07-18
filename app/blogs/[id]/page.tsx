"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line
  }, [params.id]);

  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blogs/${params.id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch blog");
      setBlog(data.blog);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!blog) return <div className="p-10 text-center text-gray-500">Blog not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl mb-2">{blog.title}</CardTitle>
          <div className="text-xs text-gray-500">By {blog.author}</div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 whitespace-pre-line">{blog.content}</div>
        </CardContent>
      </Card>
    </div>
  );
} 