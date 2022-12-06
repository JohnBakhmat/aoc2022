export {};

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n").filter(Boolean);

const columns: any = [];

let line = lines.shift()!;

while (!line.startsWith(" 1 ")) {
  for (let i = 1; i < line.length; i += 4) {
    if (line[i] === " ") continue;
    const index = (i - 1) / 4;
    columns[index] ??= [];
    columns[index].unshift(line[i]);
  }
  line = lines.shift()!;
}

//Actions

const [_, actions] = text.split("\n\n");
const actionsList = actions.split("\n");
actionsList.forEach((action) => {
  const stringArray = action.split(" ");
  const count = +stringArray[1];
  const from = +stringArray[3] - 1;
  const to = +stringArray[5] - 1;

  const stack = columns[from];
  const crates = stack.splice(stack.length - count, count);
  columns[to].push(...crates.reverse());
  console.log({ columns });
});

const topOfStacks = columns.map(
  (column: string | any[]) => column[column.length - 1]
);
const result = topOfStacks.join("");

console.log({ result });
