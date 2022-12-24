export {}

const text = await Deno.readTextFile('input.txt')

const [rawMap, rawPath] = text.split('\n\n')

const map = rawMap.split('\n').map((x) => x.split(''))
const path = rawPath.match(/\d{1,}|R|L/g)!

console.log(path)

const start = {
  x: map[0].indexOf('.'),
  y: 0,
  facing: 'R',
}

const directions = ['R', 'D', 'L', 'U']

const turn = (direction: string, isClockwise: boolean) =>
  directions[(directions.indexOf(direction) + (isClockwise ? 1 : -1)) % 4]

const move = (x: number, y: number, direction: string, count: number) => {
  for (let i = 0; i < count; i++) {
    map[y][x] = '0'

    switch (direction) {
      case 'U': {
        let tempY = y
        if (y - 1 < 0 || map[y - 1] === undefined || map[y - 1][x] === undefined || map[y - 1][x] === ' ') {
          tempY = map.findLastIndex((arr) => arr[x] !== ' ')
        } else {
          tempY--
        }
        if (map[tempY][x] === '#') return { x, y, direction }
        y = tempY
        break
      }
      case 'R': {
        let tempX = x
        if (x + 1 >= map[0].length || map[y][x + 1] === undefined || map[y][x + 1] === ' ') {
          tempX = map[y].findIndex((arr) => arr !== ' ')
        } else {
          tempX++
        }
        if (map[y][tempX] === '#') return { x, y, direction }
        x = tempX
        break
      }
      case 'D': {
        let tempY = y
        if (y + 1 >= map.length || map[y + 1] === undefined || map[y + 1][x] === undefined || map[y + 1][x] === ' ') {
          tempY = map.findIndex((arr) => arr[x] !== ' ')
        } else {
          tempY++
        }
        if (map[tempY][x] === '#') return { x, y, direction }
        y = tempY
        break
      }
      case 'L': {
        let tempX = x
        if (x - 1 < 0 || map[y][x - 1] === undefined || map[y][x - 1] === ' ') {
          tempX = map[y].findLastIndex((arr) => arr !== ' ')
        } else {
          tempX--
        }
        if (map[y][tempX] === '#') return { x, y, direction }
        x = tempX
        break
      }
    }
  }
  return { x, y }
}

let current = { ...start }
for (const cmd of path) {
  if (cmd === 'R' || cmd === 'L') {
    current.facing = turn(current.facing, cmd === 'R')
    continue
  }
  if (!cmd.match(/\d/)) throw new Error('Invalid command')

  const { x, y } = move(current.x, current.y, current.facing, parseInt(cmd))
  current = { x, y, facing: current.facing }
  //draw map
  map[current.y][current.x] = 'X'
}

console.log(map.map((x) => x.join('')).join('\n'))
console.log({
  x: current.x + 1,
  y: current.y + 1,
  facing: current.facing,
})

const result = (current.x + 1) * 4 + (current.y + 1) * 1000 + directions.indexOf(current.facing)

console.log(result)
