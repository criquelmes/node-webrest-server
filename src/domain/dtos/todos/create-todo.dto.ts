export class CreateTodoDto {
  private constructor(public readonly title: string) {}

  static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {
    const { title } = props;
    if (!title || title.length === 0)
      return ["Title property is required", undefined];

    return [undefined, new CreateTodoDto(title)];
  }
}
