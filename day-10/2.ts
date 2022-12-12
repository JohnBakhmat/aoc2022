export {};

const text = await Deno.readTextFile("input.txt");
let register = 1;

const renderedImage: Array<string> = [];
let sprite = ".".repeat(40).split("");

let currentLine: Array<string> = [];

const draw = () => {
  // 1 is 1, 41 is 1, 81 is 1
  const i = currentLine.length % 40;

  if (i === 0) {
    renderedImage.push(currentLine.join(""));
    currentLine = [];
  }
  currentLine.push(sprite[i]);
};
const updateSprite = () => {
  const emptySprite = ".".repeat(40).split("");
  emptySprite[register] = "#";
  emptySprite[register - 1] = "#";
  emptySprite[register + 1] = "#";
  sprite = [...emptySprite];
};

updateSprite();

text.split("\n").map((line) => {
  if (line.includes("noop")) {
    draw();
  }
  if (line.startsWith("addx")) {
    draw();
    draw();
    register += +line.split(" ")[1];
    updateSprite();
  }
});

const image = renderedImage.join("\n");

console.log(image.replace(/#/g, "█").replace(/\./g, " "));
