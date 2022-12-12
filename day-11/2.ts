export {};

const text = await Deno.readTextFile("input.txt");

const monkeys: {
  id: number;
  items: number[];
  test: number;
  operation: (x: number) => number;
  ifTrue: number;
  ifFalse: number;
  inspected: number;
}[] = [];

const parseOperation = (op: string) => {
  const split = op.split(" ");
  const operator = split[3];
  const operand = split[4];

  if (operand === "old") {
    switch (operator) {
      case "*":
        return (x: number) => x * x;

      case "+":
        return (x: number) => x + x;
    }
  }

  switch (operator) {
    case "*":
      return (x: number) => x * +operand;

    case "+":
      return (x: number) => x + +operand;
  }
  return (x: number) => x;
};

text.split("\n\n").map((round) => {
  const monkeyData = round.split("\n");
  const monkeyNumber = +monkeyData[0].match(/(\d{1,})/)![0];
  const items = monkeyData[1]
    .match(/\d.*/)![0]
    .split(", ")
    .map((i) => +i);
  const test = +monkeyData[3].match(/\d{1,}/)!;
  const operation = parseOperation(monkeyData[2].match(/\:\ (.*)$/)![1]);

  const ifTrue = +monkeyData[4].match(/\d{1,}/)!;
  const ifFalse = +monkeyData[5].match(/\d{1,}/)!;

  const monkey = {
    id: monkeyNumber,
    items,
    test,
    operation,
    ifTrue,
    ifFalse,
    inspected: 0,
  };

  monkeys.push(monkey);
});

console.log(
  `Start\n` +
    monkeys.map((m) => "M " + m.id + "\t" + m.items.join(",")).join("\n")
);

const divisors = monkeys.map((m) => m.test);
const lcm = divisors.reduce((acc, curr) => acc * curr, 1);
const rounds = 10000;
for (let i = 0; i < rounds; i++) {
  monkeys.forEach((monkey) => {
    monkey.items.forEach((item) => {
      const inspected = monkey.operation(item);
      monkey.inspected++;

      const bored = inspected % lcm;

      if (bored % monkey.test === 0) {
        const nextMonkey = monkeys.find((m) => m.id === monkey.ifTrue)!;
        nextMonkey.items.push(bored);
      } else {
        const nextMonkey = monkeys.find((m) => m.id === monkey.ifFalse)!;
        nextMonkey.items.push(bored);
      }
    });
    monkey.items = [];
  });
}

const sorted = monkeys
  .sort((a, b) => b.inspected - a.inspected)
  .slice(0, 2)
  .reduce((acc, m) => acc * m.inspected, 1);

console.log({ sorted });
