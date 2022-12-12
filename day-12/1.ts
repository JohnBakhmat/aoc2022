export {};

const text = await Deno.readTextFile("input.txt");
const grid = text.split("\n").map((line) => line.split(""));
const hights = "abcdefghijklmnopqrstuvwxyz";

const N = grid.length;
const M = grid[0].length;

const start = {
  x: 0,
  y: 0,
};
const end = { ...start };

for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    if (grid[i][j] === "S") {
      start.x = j;
      start.y = i;
    } else if (grid[i][j] === "E") {
      end.x = j;
      end.y = i;
    }
  }
}

const height = (char: string) => {
  if (char === "S") return 0;
  if (char === "E") return 25;
  return hights.indexOf(char);
};

const neighbors = (x: number, y: number) => {
  const result: [number, number][] = [];
  const shifts = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  for (const [dx, dy] of shifts) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= M || ny < 0 || ny >= N) continue;
    if (height(grid[ny][nx]) <= height(grid[y][x]) + 1) result.push([nx, ny]);
  }
  return result;
};

const visited = new Set<string>();
const queue: [number, number, number][] = [[start.x, start.y, 0]];
let result = 0;
while (queue.length) {
  const [x, y, cost] = queue.shift()!;
  const key = `${x},${y}`;
  if (visited.has(key)) continue;
  visited.add(key);

  if (x === end.x && y === end.y) {
    result = cost;
    break;
  }

  for (const [nx, ny] of neighbors(x, y)) {
    queue.push([nx, ny, cost + 1]);
  }
}
console.log(result);
