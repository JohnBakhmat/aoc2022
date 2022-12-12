export {};

const text = await Deno.readTextFile("input.txt");
const start = { x: 0, y: 0 };
type Point = typeof start;
const rope = new Array(10).fill(0).map(() => ({ ...start }));

const visited = new Set<string>();

visited.add(`${start.x},${start.y}`);

const follow = (head: Point, tail: Point) => {
  const isFarHorizontal = Math.abs(head.x - tail.x) > 1;
  const isFarVertical = Math.abs(head.y - tail.y) > 1;

  const isFar = isFarHorizontal || isFarVertical;
  if (isFar) {
    if (head.x > tail.x) {
      tail.x++;
    }
    if (head.x < tail.x) {
      tail.x--;
    }
    if (head.y > tail.y) {
      tail.y++;
    }
    if (head.y < tail.y) {
      tail.y--;
    }
  }
};

const switchObj: any = {
  R: () => rope[0].x++,
  L: () => rope[0].x--,
  U: () => rope[0].y++,
  D: () => rope[0].y--,
};

const move = (direction: string, count: number) => {
  if (count > 1) {
    for (let i = 0; i < count; i++) {
      move(direction, 1);
    }
    return;
  }

  switchObj[direction]();

  for (let i = 1; i < rope.length; i++) {
    follow(rope[i - 1], rope[i]);
  }

  visited.add(`${rope[9].x},${rope[9].y}`);
};

text.split("\n").forEach((line) => {
  const [direction, count] = line.split(" ");
  move(direction, Number(count));
});

console.log({
  visited: visited,
  visitedCount: visited.size,
});
