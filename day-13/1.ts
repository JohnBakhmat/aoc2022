export {};
import _ from "npm:lodash";

const expected = [true, true, false, true, false, true, false, false];
const text = await Deno.readTextFile("input.txt");

type Packet = Array<number[] | number | Packet>;

const compare = (aPac: Packet, bPac: Packet): number => {
  for (let i = 0; i < aPac.length; i++) {
    if (i >= bPac.length) return 1;

    const a = aPac[i];
    const b = bPac[i];

    if (!Array.isArray(a) && !Array.isArray(b)) {
      if (a !== b) return a - b;
    }

    if (Array.isArray(a) && !Array.isArray(b)) {
      const result = compare(a, [b]);
      if (result !== 0) return result;
    }

    if (!Array.isArray(a) && Array.isArray(b)) {
      const result = compare([a], b);
      if (result !== 0) return result;
    }

    /*
  If both values are lists, compare the first value of each list, then the second value, and so on. If the left list runs out of items first, the inputs are in the right order. If the right list runs out of items first, the inputs are not in the right order.
  */
    if (Array.isArray(a) && Array.isArray(b)) {
      const result = compare(a, b);
      if (result !== 0) return result;
    }
  }
  return aPac.length < bPac.length ? -1 : 0;
};

const result = text
  .split("\n\n")
  .map((pair) => {
    const [a, b] = pair.split("\n");
    const aArr = eval(a);
    const bArr = eval(b);

    return compare(aArr, bArr);
  })
  .map((value) => value < 0)
  .reduce((acc, value, index) => {
    if (value) return acc + index + 1;
    return acc;
  }, 0);
console.log({ result });
