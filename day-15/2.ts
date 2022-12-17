export {}

const text = await Deno.readTextFile('input.txt')
const expected = 56000011
const searchSpace = 4_000_000

type Point = { x: number; y: number }

const dist = (x1: number, y1: number, x2: number, y2: number) => Math.abs(x1 - x2) + Math.abs(y1 - y2)

const sensors: Point[] = []
const beacons: Point[] = []

text.split(`\n`).map((line) => {
  const [sx, sy, bx, by] = (line.match(/[-\d]{1,}/g) || []).map((c) => parseInt(c))
  sensors.push({ x: sx, y: sy })
  beacons.push({ x: bx, y: by })
})

const N = sensors.length

const dists: number[] = []

for (let i = 0; i < N; i++) {
  const s = sensors[i]
  const b = beacons[i]
  dists.push(dist(s.x, s.y, b.x, b.y))
}

const posSlopes: Array<number> = []
const negSlopes: Array<number> = []

sensors.map((s, i) => {
  const d = dists[i]
  negSlopes.push(...[s.x + s.y - d, s.x + s.y + d])
  posSlopes.push(...[s.x - s.y - d, s.x - s.y + d])
})

let pos = null
let neg = null

for (let i = 0; i <= N * 2; i++) {
  for (let j = i + 1; j < 2 * N; j++) {
    const a = posSlopes[i]
    const b = posSlopes[j]

    if (Math.abs(a - b) === 2) {
      pos = Math.min(a, b) + 1
    }

    const c = negSlopes[i]
    const d = negSlopes[j]

    if (Math.abs(c - d) === 2) {
      neg = Math.min(c, d) + 1
    }
  }
}

if (pos === null || neg === null) throw new Error('no solution found')
const x = (pos + neg) / 2
const y = (pos - neg) / 2

console.log({ x, y })
const actual = x * searchSpace + y

console.log({ expected, actual, pass: expected === actual })
