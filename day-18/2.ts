export {}
const text = await Deno.readTextFile('input.txt')

const cubes = text.split('\n').map((line) => line.split(',').map(Number))

const coordShifts = [
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

let surface = 0
const trapped = new Set()

cubes.forEach((cube) => {
  const neighbors = coordShifts.map((shift) => cube.map((coord, j) => coord + shift[j]))
  const lava = neighbors.filter(isLava)
  const water = neighbors.filter((n) => !isLava(n))

  surface += 6 - lava.length

  water
    .filter((c) => {
      const neighbors = coordShifts.map((shift) => c.map((coord, j) => coord + shift[j]))
      return neighbors.filter(isLava).length === 6
    })
    .forEach((c) => trapped.add(c.join(',')))
})

console.assert(trapped.size === 2546)

console.log(surface - trapped.size)
