export class TodoEntity {
  constructor(
    public id: number,
    public title: string,
    public completedAt?: Date | null
  ) {}

  get isCompleted() {
    return !!this.completedAt;
  }

  public static fromObject(object: { [key: string]: any }): TodoEntity {
    const { id, title, completedAt } = object;

    if (!id) throw new Error("id is required");
    if (!title) throw new Error("title is required");

    let newCompletedAt;
    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (isNaN(newCompletedAt.getTime())) {
        throw new Error("completedAt is invalid");
      }
    }
    return new TodoEntity(id, title, completedAt);
  }
}
