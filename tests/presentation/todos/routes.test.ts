import request from "supertest";
import { testServer } from "../../test-server";
import { prisma } from "../../../src/data/postgres";
import { todo } from "node:test";

describe("Todo route testing", () => {
  beforeAll(async () => {
    await testServer.start();
  });
  afterAll(async () => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  const todo1 = { title: "Hola mundo 1" };
  const todo2 = { title: "Hola mundo 2" };

  test("should return TODOs api/todos", async () => {
    await prisma.todo.deleteMany();
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const { body } = await request(testServer.app)
      .get("/api/todos")
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].title).toBe(todo1.title);
    expect(body[1].title).toBe(todo2.title);
    expect(body[0].completedAt).toBeNull();
  });

  test("should return TODO by id api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      title: todo.title,
      completedAt: todo.completedAt,
    });
  });

  test("Should return a 404 NotFound api(todos/:id)", async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test("Should return a new TODO api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send(todo1)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      title: todo1.title,
      completedAt: null,
    });
  });

  test("Should return an error if title is not valid property api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send({})
      .expect(400);

    expect(body).toEqual({ error: "Title property is required" });
  });

  test("Should return an error if title is empty api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send({ title: "" })
      .expect(400);

    expect(body).toEqual({ error: "Title property is required" });
  });

  test("should return an updated TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ title: "Hola mundo UPDATE", completedAt: "2023-11-06" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      title: "Hola mundo UPDATE",
      completedAt: "2023-11-06T00:00:00.000Z",
    });
  });

  test("should return 404 if TODO not found api/todos/:id", async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todoId}`)
      .send({ title: "Hola mundo UPDATE", completedAt: "2023-11-06" })
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  //Todo: Realizar la operación con errores personalizados
  test("should return an updated TODO only the date", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: "2023-11-06" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      title: todo.title,
      completedAt: "2023-11-06T00:00:00.000Z",
    });
  });

  test("should delete a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      title: todo.title,
      completedAt: null,
    });
  });

  test("should return 404 if todo not found api/todos/:id", async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });
});
