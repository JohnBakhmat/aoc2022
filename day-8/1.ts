export {};

const text = await Deno.readTextFile(`input.txt`);

const table = text
  .split("\n")
  .filter(Boolean)
  .map((r) => r.split("").map((i) => +i));

let result = 0;
for (let i = 1; i < table.length - 1; i++) {
  for (let j = 1; j < table[0].length - 1; j++) {
    const current = table[i][j];

    const left = table[i].slice(0, j);
    const right = table[i].slice(j + 1);

    const top = table.reduce((acc, row, index) => {
      if (index < i) acc.push(row[j]);
      return acc;
    }, []);

    const bottom = table.reduce((acc, row, index) => {
      if (index > i) acc.push(row[j]);
      return acc;
    }, []);

    const isVisible = [left, right, top, bottom].some((row) => {
      return row.every((i) => i < current);
    });

    if (!isVisible) continue;

    result++;
  }
}

const width = table[0].length;
const height = table.length;
const perimeter = width * 2 + height * 2 - 4;

console.table(table);
console.log({ result: perimeter + result });
