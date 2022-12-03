export {};
// const expected = 157;
// const text = await Deno.readTextFile("./input.txt");
// const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// const sacks = text.split("\n").map((sack) => {
//   const firstHalf = sack.slice(0, sack.length / 2);
//   const secondHalf = sack.slice(sack.length / 2);

//   let account = [];

//   for (let i = 0; i < firstHalf.length; i++) {
//     for (let j = 0; j < secondHalf.length; j++) {
//       if (firstHalf[i] === secondHalf[j]) {
//         account.push(firstHalf[i]);
//       }
//     }
//   }
//   const deduped = [...new Set(account)];

//   return deduped;
// });
// let sum = 0;
// const result = sacks.map((sack) =>
//   sack.map((s) => (sum += alphabet.indexOf(s) + 1))
// );

// console.log({ sum });

//Reafcatoring
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
