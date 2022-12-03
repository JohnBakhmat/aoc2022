export {};

const text = await Deno.readTextFile("./input.txt");
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const result = text
  .split("\n")
  .map((sack) => {
    const firstHalf = new Set(sack.slice(0, sack.length / 2));
    const secondHalf = new Set(sack.slice(sack.length / 2));
    return new Set([...firstHalf].filter((x) => secondHalf.has(x)));
  })
  .reduce(
    (a, c) => a + [...c].reduce((a, c) => a + alphabet.indexOf(c) + 1, 0),
    0
  );
console.log({ result });
