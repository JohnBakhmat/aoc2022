export {}

const text = await Deno.readTextFile('input.txt')

const directions = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
  NE: { x: 1, y: -1 },
  SE: { x: 1, y: 1 },
  SW: { x: -1, y: 1 },
  NW: { x: -1, y: -1 },
}

enum Tiles {
  CLEAN = '.',
  ELF = '#',
}

type Elf = {
  y: number
  x: number
  facing: keyof typeof directions | null
}

const elves = new Set<Elf>()

text.split('\n').forEach((line, i) => {
  line.split('').forEach((char, j) => {
    if (char === '#') {
      elves.add({ y: i, x: j, facing: null })
    }
  })
})

const consider = (
  elves: Set<Elf>,
  elf: Elf,
  facing: Array<keyof typeof directions>,
) => {
  return facing
    .map(dir => {
      const { x, y } = elf
      const { x: dx, y: dy } = directions[dir]
      const next = { x: x + dx, y: y + dy }
      const nextElf = [...elves].find(e => e.x === next.x && e.y === next.y)
      return nextElf === undefined
    })
    .every(v => v)
}

const directionCircle: Array<Array<keyof typeof directions>> = [
  ['N', 'NE', 'NW'],
  ['S', 'SE', 'SW'],
  ['W', 'NW', 'SW'],
  ['E', 'NE', 'SE'],
]

const drawGrid = (elves: Set<Elf>, phase: string) => {
  const arr = Array.from(elves)
  const maxX = Math.max(...arr.map(e => e.x))
  const maxY = Math.max(...arr.map(e => e.y))
  const minX = Math.min(...arr.map(e => e.x))
  const minY = Math.min(...arr.map(e => e.y))

  const grid = new Array(maxY - minY + 1)
    .fill(0)
    .map(() => new Array(maxX - minX + 1).fill(Tiles.CLEAN))

  for (const elf of elves) {
    grid[elf.y - minY][elf.x - minX] =
      phase === 'Consideration phase' ? elf.facing || Tiles.ELF : Tiles.ELF
  }

  console.log(`========${phase}=========`)
  console.log(grid.map(line => line.join('')).join('\n'))
}

drawGrid(elves, 'Initial state')

const roundLimit = 10
for (let round = 0; round < roundLimit; round++) {
  console.log(`\n\nRound ${round + 1}`)
  //Consideration phase
  for (const elf of elves) {
    for (const dir of directionCircle) {
      if (consider(elves, elf, dir)) {
        elf.facing = dir[0]
        break
      } else {
        elf.facing = null
      }
    }
  }
  drawGrid(elves, 'Consideration phase')

  //Movement phase

  const movePlan = [...elves].map(elf => {
    if (!elf.facing) return { elf, ...elf }

    const { x, y } = elf
    const { x: dx, y: dy } = directions[elf.facing]
    return { elf, x: x + dx, y: y + dy }
  })

  for (const { elf, x, y } of movePlan) {
    const otherElf = [...movePlan].filter(e => e.x === x && e.y === y)
    if (otherElf.length > 1) continue
    elves.delete(elf)
    elves.add({ ...elf, x, y })
  }
  drawGrid(elves, 'Movement phase')

  // direction circle shift
  const first = directionCircle.shift()
  if (first) directionCircle.push(first)
}
