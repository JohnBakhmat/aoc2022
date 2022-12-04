export {};

const text = await Deno.readTextFile("./input.txt");

const res = text
  .split("\n")
  .map((pair) => {
    const [a, b, c, d] = pair
      .split(",|-")
      .map((x) => parseInt(x, 10))
      .sort();
    return (a <= c && d <= b) || (c <= a && b <= d);
  })
  .filter((x) => x).length;
console.log({ res });
