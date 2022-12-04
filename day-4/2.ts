export {};

const text = await Deno.readTextFile("./input.txt");

const res = text
  .split("\n")
  .map((pair) => {
    const [a, b, c, d] = pair
      .split(",|-")
      .map((x) => parseInt(x, 10))
      .sort();
    return !(b < c || a > d);
  })
  .filter((x) => x).length;

console.log({ res });
