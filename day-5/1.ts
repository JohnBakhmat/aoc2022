export {};

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n").filter(Boolean);

const columns: any = [];

let line = lines.shift()!;

while (!line.match(/^[1-9 ]*$/)) {
  for (let i = 1; i < line.length; i += 4) {
    if (line[i] === " ") continue;
    const index = (i - 1) / 4;
    columns[index] ??= [];
    columns[index].unshift(line[i]);
  }
  line = lines.shift()!;
}

//Actions

text
  .split("\n\n")[1]
  .split("\n")
  .forEach((action) => {
    const stringArray = action.split(" ");
    const count = +stringArray[1];
    const from = +stringArray[3] - 1;
    const to = +stringArray[5] - 1;

    columns[to].push(
      ...columns[from].splice(columns[from].length - count, count)
    );
  });

const result = columns.map((column: any) => column[column.length - 1]).join("");

console.log({ result });
