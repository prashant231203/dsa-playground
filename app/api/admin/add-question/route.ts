import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const { title, body } = await req.json();
  const filePath = path.join(process.cwd(), 'content', 'questions.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const questions = JSON.parse(data);
  const newId = questions.length > 0 ? Math.max(...questions.map((q: any) => q.id)) + 1 : 1;
  const newQuestion = { id: newId, title, body };
  questions.push(newQuestion);
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
  return NextResponse.json({ success: true, question: newQuestion });
} 