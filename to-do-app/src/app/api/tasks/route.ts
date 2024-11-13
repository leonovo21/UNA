import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, dueDate } = await req.json();
    const newTask = await prisma.task.create({
      data: {
        title,
        dueDate: new Date(dueDate),
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao adicionar a tarefa' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar as tarefas' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: 'Tarefa deletada com sucesso' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar a tarefa' }, { status: 500 });
  }
}