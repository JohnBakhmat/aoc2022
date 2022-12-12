export {};

const text = await Deno.readTextFile(`input.txt`);

const table = text
  .split("\n")
  .filter(Boolean)
  .map((r) => r.split("").map((i) => +i));

const scores = [];
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

    const viewReducer = (acc: any, item: number, index: number, arr: any[]) => {
      acc++;
      if (current <= item) {
        arr.splice(index);
      }
      return acc;
    };

    const leftView = left.reverse().reduce(viewReducer, 0);
    const rightView = right.reduce(viewReducer, 0);
    const topView = top.reverse().reduce(viewReducer, 0);
    const bottomView = bottom.reduce(viewReducer, 0);
    const score = leftView * rightView * topView * bottomView;
    scores.push(score);
  }
}
const maxScore = Math.max(...scores);
console.table(table);
console.log({ result: maxScore });
