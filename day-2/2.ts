const text = await Deno.readTextFile("./input.txt");
const abc = "ABC";
const xyz = "XYZ";

const result = text
  .split("\n")
  .map((round) => {
    const [a, b] = round.split(" ");

    const indexA = abc.indexOf(a.charAt(0)) + 1;
    const indexX = xyz.indexOf(b.charAt(0)) + 1;

    const toWin = indexA < 3 ? indexA + 1 : 1;
    const toLose = indexA > 1 ? indexA - 1 : 3;

    switch (b) {
      case "X":
        return 0 + toLose;
      case "Y":
        return 3 + indexA;
      case "Z":
        return 6 + toWin;
      default:
        return 0;
    }
  })
  .reduce((a, b) => a + b, 0);

console.log(result);
export {};
