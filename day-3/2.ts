export {};
const text = await Deno.readTextFile("./input.txt");
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const result = text
  .split("\n")
  .reduce((acc, curr, i) => {
    if (i % 3 === 0) acc.push([]);
    acc[acc.length - 1].push(curr);
    return acc;
  }, [] as string[][])
  .map((group) =>
    group
      .map((sack) => new Set(sack))
      .reduce((acc, curr) => new Set([...acc].filter((x) => curr.has(x))))
  )
  .map((badge) => [...badge].map((s) => alphabet.indexOf(s) + 1))
  .reduce((a, c) => a + c.reduce((a, c) => a + c, 0), 0);

console.log({ result });
