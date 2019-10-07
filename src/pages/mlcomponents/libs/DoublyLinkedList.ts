/**
 * Linked list node
 */
export interface DoublyLinkedListNode<T> {
  value: T
  next?: DoublyLinkedListNode<T>
  prev?: DoublyLinkedListNode<T>
}

/**
 * Linked list for items of type T
 */
export class DoublyLinkedList<T> {
  public head?: DoublyLinkedListNode<T> = undefined;
  public tail?: DoublyLinkedListNode<T> = undefined;
  private length : number = 0;

  /**
   * Adds an item in O(1)
   **/
  add(value: T) {
    const node: DoublyLinkedListNode<T> = {
      value,
      next: undefined,
      prev: undefined,
    }
    if (!this.head) {
      this.head = node;
    }
    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
    }
    this.tail = node;
    this.length += 1;
  }

  /**
   * FIFO removal in O(1)
   */
  dequeue(): T | undefined {
    if (this.head) {
      const value = this.head.value;
      this.head = this.head.next;
      if (!this.head) {
        this.tail = undefined;
      }
      else {
        this.head.prev = undefined;
      }
      this.length -= 1;
      return value;
    }
  }

  /**
   * LIFO removal in O(1)
   */
  pop(): T | undefined {
    if (this.tail) {
      const value = this.tail.value;
      this.tail = this.tail.prev;
      if (!this.tail) {
        this.head = undefined;
      }
      else {
        this.tail.next = undefined;
      }
      this.length -= 1;
      return value;
    }
  }

  tailValue() : T | undefined {
    return this.tail.value;
  }
  valueAtOffset(ofst : number) : T | undefined {
    let cur : DoublyLinkedListNode<T>  = this.head;
    let n : number = 0;
    while(n < ofst) {
      cur = cur.next;
      n += 1;
    }
    return cur.value;
  }

  listLength() : number {
    return this.length;
  }

  removeNode(ofst : number) {
    let cur : DoublyLinkedListNode<T>  = this.head;
    let prev : DoublyLinkedListNode<T>  = this.head;
    let n : number = 0;
    while(n <= ofst) {
      prev = cur;
      cur = this.head.next;
      n += 1;
    }
    prev.next = cur;
    cur.prev = prev;
    this.length -= 1;
  }

  /**
   * Returns an iterator over the values
   */
  *values() {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
