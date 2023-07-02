export class Stack<T> {
  private stack: T[] = [];

  push(item: T): void {
    this.stack.push(item);
  }

  pop(): T | undefined {
    return this.stack.pop();
  }

  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.stack[this.stack.length - 1];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  size(): number {
    return this.stack.length;
  }

  clear(): void {
    this.stack = [];
  }
}
