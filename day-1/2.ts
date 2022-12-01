const text = await Deno.readTextFile("./input.txt");

const result = text
  .split("\n\n")
  .map((elf) =>
    elf
      .split("\n")
      .map((i) => parseInt(i))
      .reduce((a, b) => a + b, 0)
  )
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((a, b) => a + b, 0);

console.log(result);

export {};
