import { Request, Response } from "express";

const todos = [
  { id: 1, title: "Todo 1", completedAt: new Date() },
  { id: 2, title: "Todo 2", completedAt: null },
  { id: 3, title: "Todo 3", completedAt: new Date() },
];

export class TodosController {
  //* Dependency injection
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const todo = todos.find((todo) => todo.id === Number(id));
    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newTodo = { id: todos.length + 1, title, completedAt: null };
    todos.push(newTodo);

    return res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const todo = todos.find((todo) => todo.id === Number(id));
    if (!todo)
      return res.status(404).json({ error: `TODO with id ${id} not found` });

    const { title, completedAt } = req.body;
    // if (!title) return res.status(400).json({ error: "Title is required" });

    todo.title = title || todo.title;
    completedAt === null
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));

    return res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const todo = todos.find((todo) => todo.id === Number(id));
    if (!todo)
      return res.status(404).json({ error: `TODO with id ${id} not found` });

    todos.splice(todos.indexOf(todo), 1);

    return res.json(todo);
  };
}
