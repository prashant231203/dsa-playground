let questions = [
  { id: 1, title: "What is a linked list?", body: "A linked list is a linear data structure where each element points to the next." },
  { id: 2, title: "Explain binary search.", body: "Binary search is an efficient algorithm for finding an item from a sorted list of items." }
];

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const question = questions.find(q => String(q.id) === params.id);
  if (!question) return new Response('Not found', { status: 404 });
  return Response.json(question);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { title, body } = await req.json();
  const idx = questions.findIndex(q => String(q.id) === params.id);
  if (idx === -1) return new Response('Not found', { status: 404 });
  questions[idx] = { ...questions[idx], title, body };
  return Response.json({ success: true, question: questions[idx] });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const idx = questions.findIndex(q => String(q.id) === params.id);
  if (idx === -1) return new Response('Not found', { status: 404 });
  questions.splice(idx, 1);
  return Response.json({ success: true });
} 