export {}

const text = await Deno.readTextFile('input.txt')

let maxX = 0
let minX = 100000
let minY = 100000

const data = text.split('\n')
data.forEach((line) => {
  const [xs, ys, xb, yb] = line.match(/[-\d]{1,}/g)!.map((coord) => parseInt(coord))
  maxX = Math.max(maxX, xs, xb)
  minX = Math.min(minX, xs, xb)
  minY = Math.min(minY, ys, yb)
})

const counted = new Set<string>()
const yToCheck = 2000000
const rowToCheck = yToCheck

data.forEach((line) => {
  const [xs, ys, xb, yb] = line.match(/[-\d]{1,}/g)!.map((coord) => parseInt(coord))

  const distance = Math.abs(xs - xb) + Math.abs(ys - yb)

  const xGap = distance * 10
  const minX = Math.min(xs, xb) - xGap
  const maxX = Math.max(xs, xb) + xGap

  for (let j = minX; j < maxX; j++) {
    if ((xs === j && ys === rowToCheck) || (xb === j && yb === rowToCheck)) continue
    if (Math.abs(xs - j) + Math.abs(ys - rowToCheck) <= distance) {
      counted.add(`${rowToCheck},${j}`)
    }
  }
})

console.log({ counted: counted.size })

const expected = 5394423
const actual = counted.size

console.log({ expected, actual, pass: expected === actual })
