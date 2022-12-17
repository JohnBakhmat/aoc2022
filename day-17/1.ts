export {}

console.clear()
console.time('Time')

const text = await Deno.readTextFile('input.txt')
const moves = text.split('')

const grid = new Array(30000).fill(0).map(() => new Array(7).fill('.'))

const shapes = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 1],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
]

let iteration = 0
let height = 0

const canFall = (y: number, x: number) => {
  if (y - 1 < 0) return false
  return grid[y - 1][x] === '.' || grid[y - 1][x] === '@'
}

type Directions = '<' | '>'

const canMove = (y: number, x: number, direction: Directions) => {
  if (direction === '<') {
    if (x - 1 < 0) return false
    return grid[y][x - 1] === '.' || grid[y][x - 1] === '@'
  }

  if (direction === '>') {
    if (x + 1 > 6) return false
    return grid[y][x + 1] === '.' || grid[y][x + 1] === '@'
  }
}

const getHeight = (grid: string[][]) => {
  const height = grid.map((row) => row.some((cell) => cell === '#')).filter(Boolean).length

  return height
}

let moveCount = 0

while (iteration < 2021) {
  //Each rock appears so that its left edge is two units away from the left wall and its bottom edge is three units above the highest rock in the room

  const shapeRef = shapes[iteration % shapes.length]
  const spawnX = 2
  const spawnY = 3 + height

  let shape = [...shapeRef].map(([y, x]) => [y + spawnY, x + spawnX])

  //update grid height

  for (const [y, x] of shape) {
    grid[y][x] = '@'
  }
  // console.table(grid)
  while (true) {
    // Wind

    const canMoveLeft = shape.every(([y, x]) => canMove(y, x, '<'))
    const canMoveRight = shape.every(([y, x]) => canMove(y, x, '>'))

    const move = moves[moveCount++ % moves.length]
    if (move === '<' && canMoveLeft) {
      shape = shape.map(([y, x]) => {
        grid[y][x] = '.'
        grid[y][x - 1] = '@'
        return [y, x - 1]
      })
    }

    if (move === '>' && canMoveRight) {
      shape = shape.map(([y, x]) => {
        grid[y][x] = '.'
        grid[y][x + 1] = '@'
        return [y, x + 1]
      })
    }

    //Fall
    const canFallV = shape.every(([y, x]) => canFall(y, x))
    if (!canFallV) {
      shape.forEach(([y, x]) => (grid[y][x] = '#'))
      height = getHeight(grid)
      break
    }

    shape = shape.map(([y, x]) => {
      grid[y][x] = '.'
      grid[y - 1][x] = '@'
      return [y - 1, x]
    })
    // console.table(grid)
  }
  // console.table(grid)

  iteration++
}

// console.table(grid.reverse())

const string = grid
  .reverse()
  .map((row) => row.join(''))
  .join('\n')
console.log(string)
console.log(height)
// console.table(grid)
console.timeLog('Time')
