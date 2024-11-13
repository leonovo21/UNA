"use client";

import React, { useState, useEffect } from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Função para buscar as tarefas ao carregar a página
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Erro ao buscar as tarefas");
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };

    fetchTasks();
  }, []);

  // Função para adicionar nova tarefa
  const addTask = async () => {
    if (!newTask || !dueDate) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTask, dueDate }),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks([...tasks, addedTask]);
        setNewTask("");
        setDueDate("");
      } else {
        console.error("Erro ao adicionar a tarefa");
      }
    } catch (error) {
      console.error("Erro ao enviar a requisição:", error);
    }
  };

  // Função para excluir tarefa
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        console.error("Erro ao excluir a tarefa");
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-100">Lista de Tarefas</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Descrição da tarefa"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-600 rounded bg-gray-700 text-gray-300"
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-600 rounded bg-gray-700 text-gray-300"
          />
          <button
            onClick={addTask}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Adicionar Tarefa
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-2 bg-gray-700 rounded"
            >
              <div>
                <p className="text-gray-200">{task.title}</p>
                <p className="text-sm text-gray-500">{new Date(task.dueDate).toLocaleString()}</p>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}