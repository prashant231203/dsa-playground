let questions = [
  { id: 1, title: "What is a linked list?", body: "A linked list is a linear data structure where each element points to the next." },
  { id: 2, title: "Explain binary search.", body: "Binary search is an efficient algorithm for finding an item from a sorted list of items." }
];

export async function GET() {
  return Response.json(questions);
}

export async function POST(req: Request) {
  const { title, body } = await req.json();
  const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
  const newQuestion = { id: newId, title, body };
  questions.push(newQuestion);
  return Response.json({ success: true, question: newQuestion });
} 