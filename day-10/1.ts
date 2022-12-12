export { }

const text = await Deno.readTextFile("input.txt");
let cycle = 0;
let register = 1;
let milestones: {
  [key: number]: number;
} = {};
const checkMilestone = () => {
  if (cycle == 20 || (cycle - 20) % 40 === 0) {
    milestones[cycle] = register * cycle;
  }
}

const doNothing = (count: number) => {
  for (let i = 0; i < count; i++) {
    cycle++;
    checkMilestone();
  }

}
text.split('\n').map(line => {
  if (line.includes('noop')) {
    doNothing(1);
  }
  if (line.startsWith('addx')) {
    doNothing(2);
    register += +line.split(" ")[1];
  }
})

const strengthSum = Object.values(milestones).reduce((a, c) => a + c);

console.log({ milestones, strengthSum });
