export {}

const text = await Deno.readTextFile('input.txt')
enum Tiles {
  Air = ' ',
  Rocks = '#',
  Sand = '█',
}

const grid: Array<Array<string>> = new Array(1000).fill(0).map(() => new Array(1000).fill(Tiles.Air))
let minX = 100000
let maxX = 0
let minY = 0
let maxY = 0
//Place rocks
text.split('\n').forEach((line) => {
  const points = line.split('->')
  for (let i = 0; i < points.length - 1; i++) {
    let [x, y] = points[i].trim().split(',').map(Number)
    let [x1, y1] = points[i + 1]?.trim().split(',').map(Number)

    y = y
    y1 = y1
    minX = Math.min(minX, x, x1)
    maxX = Math.max(maxX, x, x1)
    minY = Math.min(minY, y, y1)
    maxY = Math.max(maxY, y, y1)
    if (x == x1) {
      for (let j = Math.min(y, y1); j <= Math.max(y, y1); j++) {
        grid[j] = grid[j] || []
        grid[j][x] = Tiles.Rocks
      }
    } else if (y == y1) {
      for (let j = Math.min(x, x1); j <= Math.max(x, x1); j++) {
        grid[y] = grid[y] || []
        grid[y][j] = Tiles.Rocks
      }
    }
  }
})

//cut off the edges
minX = minX - 1
maxX = maxX + 1

grid.splice(0, minY)
grid.splice(maxY - minY + 1)
grid.forEach((row) => {
  row.splice(0, minX - 1)
  row.splice(maxX - minX + 1)
})

const startX = 500 - minX + 1
const startY = 0

// console.log({ maxX, minX, maxY, minY })

// simulate sand falling
const canFallStraight = (x: number, y: number) => grid[y + 1] && grid[y + 1][x] == Tiles.Air
const canFallLeft = (x: number, y: number) => grid[y + 1] && grid[y + 1][x - 1] == Tiles.Air
const canFallRight = (x: number, y: number) => grid[y + 1] && grid[y + 1][x + 1] == Tiles.Air
const canFall = (x: number, y: number) => canFallStraight(x, y) || canFallLeft(x, y) || canFallRight(x, y)

const canFallIntoTheVoid = (x: number, y: number) => {
  const tilesUnder = []
  while (grid[y + 1]) {
    tilesUnder.push(grid[y + 1][x])
    y++
  }
  return tilesUnder.every((tile) => tile == Tiles.Air)
}

const loop = () => {
  let iteration = 0
  while (iteration < 3000000) {
    const sand = [startX, startY]

    while (canFall(sand[0], sand[1])) {
      if (canFallStraight(sand[0], sand[1])) {
        sand[1]++
      } else if (canFallLeft(sand[0], sand[1])) {
        sand[0]--
      } else if (canFallRight(sand[0], sand[1])) {
        sand[0]++
      }
    }

    //draw sand
    grid[sand[1]][sand[0]] = Tiles.Sand
    iteration++
    if (startX == sand[0] && startY == sand[1]) {
      return iteration
    }

    if (canFallIntoTheVoid(sand[0], sand[1])) {
      throw new Error('Fell into the void')
    }

    // console.log('Iteration: ', iteration)

    //draw grid
    // console.log(grid.map((row) => row.join('')).join('\n'))
    // console.table(grid)
  }
  return 0
}
const iterations = loop()
console.log('Iterations ', iterations)
