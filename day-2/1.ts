const text = await Deno.readTextFile("./input.txt");
const abc = "ABC";
const xyz = "XYZ";

const signs: any = {
  rock: ["A", "X"],
  paper: ["B", "Y"],
  scisors: ["C", "Z"],
};

const result = text
  .split("\n")
  .map((round) => {
    const [a, b] = round.split(" ");
    const aInt = a.charAt(0);
    const bInt = b.charAt(0);

    const indexA = abc.indexOf(aInt) + 1;
    const indexX = xyz.indexOf(bInt) + 1;

    if (indexA === indexX) return indexX + 3;
    if (indexX - 1 === indexA || (indexX === 1 && indexA === 3))
      return 6 + indexX;
    if (indexX + 1 === indexA || (indexX === 3 && indexA === 1))
      return 0 + indexX;

    return 0;
  })
  .reduce((a, b) => a + b, 0);

console.log(result);
export {};
