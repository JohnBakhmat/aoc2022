export {}

const text = await Deno.readTextFile('input.txt')

const cubes = text.split('\n').map((line) => line.split(',').map(Number))
const shifts = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
]

const isLava = (cube: number[]) => {
  return cubes.findIndex((c) => c[0] === cube[0] && c[1] === cube[1] && c[2] === cube[2]) !== -1
}
const surface = cubes.reduce((acc, cube) => {
  const neighbors = shifts.map((s) => cube.map((c, j) => c + s[j])).filter(isLava)
  return acc + 6 - neighbors.length
}, 0)

console.log(surface)
