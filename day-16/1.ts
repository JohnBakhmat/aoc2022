export {}
// console.clear()

const getResult = (input: string) => {
  const regex = new RegExp(/([A-Z]{2}).*=(\d{1,}).*(valves|valve) ([A-Z\,\ ]*)/)

  const valves = new Map(
    input.split('\n').map((line) => {
      const match = regex.exec(line)
      if (!match) throw new Error('Invalid input')
      const [, id, flow, , tunnels] = match

      return [
        id,
        {
          id,
          flow: Number(flow),
          tunnels: tunnels.split(', '),
        },
      ]
    }),
  )

  const visited = new Set<string>()
  const results = []

  const queueStart: QueueItem = {
    loc: 'AA',
    time: 30,
    pressureReleased: 0,
    opened: new Set(),
    log: [],
  }
  const queue = [queueStart]

  while (queue.length > 0) {
    const current = queue.shift()!
    const valve = valves.get(current.loc)!
    if (current.time < 0) continue
    if (current.time === 0) {
      results.push(current)
      continue
    }

    if (visited.has(`${current.loc}-${current.pressureReleased}-${JSON.stringify(current.opened.values())}`)) continue
    visited.add(`${current.loc}-${current.pressureReleased}-${JSON.stringify(current.opened.values())}`)

    for (const tunnel of valve.tunnels) {
      queue.push({
        loc: tunnel,
        time: current.time - 1,
        pressureReleased: current.pressureReleased,
        opened: current.opened,
        log: [...current.log, `go to ${tunnel}`],
      })
    }

    if (!current.opened.has(valve.id)) {
      const opened = new Set([valve.id, ...current.opened.values()])
      const pressureReleased = current.pressureReleased + valve.flow * (current.time - 1)
      for (const tunnel of valve.tunnels) {
        queue.push({
          loc: tunnel,
          time: current.time - 2,
          pressureReleased,
          opened,
          log: [...current.log, `open ${valve.id}`, `go to ${tunnel}`],
        })
      }
    }
  }

  return results
}

type QueueItem = {
  loc: string
  time: number
  pressureReleased: number
  opened: Set<string>
  log: string[]
}

const text = await Deno.readTextFile('input.txt')
const expected = 1651

const result = getResult(text).sort((a, b) => b.pressureReleased - a.pressureReleased)[0].pressureReleased

console.log({ result })
