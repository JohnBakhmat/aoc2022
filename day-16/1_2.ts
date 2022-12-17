export {}
const text = await Deno.readTextFile('input.txt')

console.log('real answer B:', solveB3(text))

function solveB3(input: string) {
  const valves = new Map(
    input.split('\n').map((l) => {
      const [currValve, flowRate, tunnels] = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/
        .exec(l)
        ?.slice(1) as [string, string, string]
      return [
        currValve,
        {
          id: currValve,
          flow: Number(flowRate),
          tunnels: tunnels.split(', '),
          paths: new Map<string, number>(),
        },
      ]
    }),
  )
  type Valve = NonNullable<ReturnType<typeof valves.get>>

  for (const v of valves.values()) {
    v.paths.set(v.id, 0)
    const queue = []
    const helper = (vv: Valve, d: number) => {
      for (const t of vv.tunnels) {
        if (v.paths.has(t)) {
          continue
        }
        v.paths.set(t, d)
        queue.push(() => helper(valves.get(t)!, d + 1))
      }
    }
    queue.push(() => helper(v, 1))
    while (queue.length > 0) {
      queue.shift()!()
    }
  }

  const importantValves = Array.from(valves.entries())
    .filter(([, v]) => v.flow > 0)
    .map(([k]) => k)

  let moves = [
    {
      loc: 'AA',
      time: 26,
      pressureReleased: 0,
      opened: new Set<string>(),
    },
  ]
  type Move = typeof moves[0]
  const possible: Move[] = []

  for (let R = 1; moves.length > 0; R++) {
    // Perform each round independently
    const round: Move[] = []
    for (const m of moves) {
      // Try opening each remaining valve
      for (const v of importantValves) {
        if (m.opened.has(v)) {
          continue
        }
        const V = valves.get(v)!
        const time = m.time - 1 - V.paths.get(m.loc)!
        if (time < 0) {
          continue
        }
        round.push({
          loc: v,
          time,
          pressureReleased: m.pressureReleased + V.flow * time,
          opened: new Set([...m.opened.values(), v]),
        })
      }
    }
    // Now that we have all 15x moves, try to crunch down the possibilities
    // If loc and opened are the same, only leave the one with the higher pressureReleased
    const dedup = new Map<string, Move[]>()
    for (const m of round) {
      const k = `${m.loc}-${Array.from(m.opened.values()).sort().join('.')}`
      const v = dedup.get(k) || []
      v.push(m)
      dedup.set(k, v)
    }
    const remaining = Array.from(dedup.values()).map((g) => {
      return g.sort((a, b) => b.pressureReleased - a.pressureReleased)[0]!
    })
    // console.log(`Round ${R}: ${moves.length} -> ${round.length} -> ${remaining.length}`)
    possible.push(...remaining)
    moves = remaining
  }

  // Now we need to find the combination of two that gives the highest answer
  const overlap = <T>(a: Set<T>, b: Set<T>) => {
    for (const e of a) {
      if (b.has(e)) {
        return true
      }
    }
    return false
  }
  const final = possible
    .map((M) => {
      return possible.filter((E) => !overlap(M.opened, E.opened)).map((E) => M.pressureReleased + E.pressureReleased)
    })
    .flat()

  final.sort((a, b) => b - a)
  return final[0]
}

interface Node<T> {
  key: number
  value: T
}

interface PriorityQueue<T> {
  insert(item: T, priority: number): void
  pop(): T
  size(): number
}

function priorityQueue<T>(init: T[]): PriorityQueue<T> {
  let heap: Node<T>[] = init.map((value) => ({ key: 0, value }))

  const parent = (index: number) => Math.floor((index - 1) / 2)
  const left = (index: number) => 2 * index + 1
  const right = (index: number) => 2 * index + 2
  const hasLeft = (index: number) => left(index) < heap.length
  const hasRight = (index: number) => right(index) < heap.length

  const swap = (a: number, b: number) => {
    const tmp = heap[a]!
    heap[a] = heap[b]!
    heap[b] = tmp
  }

  return {
    size: () => heap.length,

    insert: (item, prio) => {
      heap.push({ key: prio, value: item })

      let i = heap.length - 1
      while (i > 0) {
        const p = parent(i)
        if (heap[p]!.key < heap[i]!.key) break
        const tmp = heap[i]!
        heap[i] = heap[p]!
        heap[p] = tmp
        i = p
      }
    },

    pop: () => {
      if (heap.length == 0) throw new Error('heap empty')

      swap(0, heap.length - 1)
      const item = heap.pop()!

      let current = 0
      while (hasLeft(current)) {
        let smallerChild = left(current)
        if (hasRight(current) && heap[right(current)]!.key < heap[left(current)]!.key) smallerChild = right(current)

        if (heap[smallerChild]!.key > heap[current]!.key) break

        swap(current, smallerChild)
        current = smallerChild
      }

      return item.value
    },
  }
}
