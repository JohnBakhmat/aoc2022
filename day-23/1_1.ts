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

const extendGrid = (grid: string[][]) => {
  const increase = 1

  const newGrid = new Array(grid.length + increase * 2)
    .fill(0)
    .map(() => new Array(grid[0].length + increase * 2).fill(Tiles.CLEAN))

  for (let i = increase; i < grid.length; i++) {
    for (let j = increase; j < grid[i].length; j++) {
      newGrid[i][j] = grid[i][j]
    }
  }

  return newGrid
}

const ogGrid = text.split('\n').map((line, i) =>
  line.split('').map((char, j) => {
    if (char === '#') {
      elves.add({ y: i, x: j, facing: null })
      return Tiles.ELF
    }
    return Tiles.CLEAN
  }),
)

console.log('========Initial state=========')
console.log(ogGrid.map(line => line.join('')).join('\n'))

const consider = (
  grid: string[][],
  elf: Elf,
  facing: Array<keyof typeof directions>,
) =>
  facing
    .map(direction => {
      const { x, y } = elf
      const { x: dx, y: dy } = directions[direction]
      return grid[y + dy][x + dx] === Tiles.CLEAN
    })
    .every(dir => dir === true)

//rounds

const directionCircle: Array<Array<keyof typeof directions>> = [
  ['N', 'NE', 'NW'],
  ['S', 'SE', 'SW'],
  ['W', 'NW', 'SW'],
  ['E', 'NE', 'SE'],
]

let grid = [...ogGrid].map(line => [...line])

const roundLimit = 10
for (let round = 0; round < roundLimit; round++) {
  //Consideration phase
  for (const elf of elves) {
    for (const dirPair of directionCircle) {
      const canMove = consider(grid, elf, dirPair)
      if (canMove) {
        elf.facing = dirPair[0]
        break
      } else {
        elf.facing = null
      }
    }
  }

  //grow grid
  const anyIsNearBorder = [...elves].some(
    elf =>
      elf.x === 0 ||
      elf.x === grid[0].length - 1 ||
      elf.y === 0 ||
      elf.y === grid.length - 1,
  )

  if (anyIsNearBorder) {
    grid = extendGrid(grid)
  }

  console.log('========Consideration phase=========')
  console.log(
    grid
      .map((line, i) =>
        line
          .map((cell, j) => {
            const elf = [...elves].find(e => e.x === j && e.y === i)
            if (!elf) return cell
            return elf.facing || '#'
          })
          .join(''),
      )
      .join('\n'),
  )

  //Movement phase

  const elvesPlan = [...elves].map(elf => {
    if (!elf.facing) return { elf, ...elf }
    const { x, y } = elf
    const { x: dx, y: dy } = directions[elf.facing]
    return { elf, x: x + dx, y: y + dy }
  })

  for (const plan of elvesPlan) {
    const { elf, x, y } = plan
    const otherElf =
      [...elvesPlan].filter(e => e.x === x && e.y === y).length > 1
    if (otherElf) continue
    grid[elf.y][elf.x] = Tiles.CLEAN
    grid[y][x] = Tiles.ELF
    elf.x = x
    elf.y = y
  }
  console.log('========Movement phase=========')
  console.log(grid.map(line => line.join('')).join('\n'))

  //move first element to the end
  const first = directionCircle.shift()
  if (first) directionCircle.push(first)
}
