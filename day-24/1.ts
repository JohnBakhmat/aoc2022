export {}

const input = await Deno.readTextFile('input.txt')

const grid = input.split('\n').map(line => line.split(''))

// dont count walls
const maxX = grid[0].length - 2
const maxY = grid.length - 2

const map = new Array(maxY).fill(0).map(() => new Array(maxX).fill(0))

for (let y = 0; y < maxY; y++) {
  for (let x = 0; x < maxX; x++) {
    map[y][x] = grid[y + 1][x + 1]
  }
}

type Point = {
  x: number
  y: number
}
const trip = (start: Point, end: Point, st: number) => {
  let stack = [start]
  const visited = new Set<string>()
  const moves = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
  ]

  let t = st
  let tm = 0

  while (stack.length) {
    const nstack = []
    t += 1
    tm = t % (maxX * maxY)
    const tx = maxX - (t % maxX)
    const ty = maxY - (t % maxY)

    for (const { x, y } of stack) {
      if (x === start.x && y === start.y && tm !== st) {
        nstack.push(start)
      }

      for (const { x: dx, y: dy } of moves) {
        const nx = x + dx
        const ny = y + dy

        if (nx === end.x && ny === end.y) {
          return t
        }

        if (nx < 0 || ny < 0 || nx >= maxX || ny >= maxY) {
          continue
        }

        const code = `${nx}${ny}${tx}${ty}`
        if (visited.has(code)) {
          continue
        }

        const a = map[ny][(nx + t) % maxX]
        const b = map[(ny + t) % maxY][nx]

        if (a !== '<' && a !== '>' && b !== '^' && b !== 'v') {
          visited.add(code)
          nstack.push({ x: nx, y: ny })
        }
      }
    }
    stack = nstack
  }
  return -1
}

const part1 = () => {
  return trip(
    {
      x: 0,
      y: -1,
    },
    {
      x: maxX - 1,
      y: maxY,
    },
    0,
  )
}

console.log('part1', part1())
