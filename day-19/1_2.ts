export {}

// Each robot can collect 1 of its resource type per minute.
// Factory takes 1 minute to produce 1 robot.
// Factory consumes nessesary resources to produce a robot when commanded.

const text = await Deno.readTextFile('input.txt')

const regexp =
  /(\d{1,}):.*ore robot costs (\d{1,}).*clay robot costs (\d{1,}).*obsidian robot costs (\d{1,}) ore and (\d{1,}).*geode robot costs (\d{1,}).*and (\d{1,})/

type Robot = {
  ore: number
  clay: number
  obsidian: number
  resource: Resource
}

type Resource = 'ore' | 'clay' | 'obsidian' | 'geode'

type Blueprint = {
  id: number
  bots: Robot[]
  maxSpent: {
    [key in Resource]: number
  }
}

const blueprints = text.split('\n').map((line) => {
  const match = regexp.exec(line)
  if (!match) throw new Error('no match')

  const blueprintNumber = Number(match[1])

  const oreBot = {
    ore: Number(match[2]),
    clay: 0,
    obsidian: 0,
    resource: 'ore',
  }

  const clayBot = {
    ore: Number(match[3]),
    clay: 0,
    obsidian: 0,
    resource: 'clay',
  }

  const obsidianBot = {
    ore: Number(match[4]),
    clay: Number(match[5]),
    obsidian: 0,
    resource: 'obsidian',
  }

  const geodeBot = {
    ore: Number(match[6]),
    clay: 0,
    obsidian: Number(match[7]),
    resource: 'geode',
  }

  return {
    id: blueprintNumber,
    bots: [oreBot, clayBot, obsidianBot, geodeBot],
    maxSpent: {
      ore: Math.max(oreBot.ore, clayBot.ore, obsidianBot.ore, geodeBot.ore),
      clay: Math.max(clayBot.clay, obsidianBot.clay, geodeBot.clay),
      obsidian: Math.max(obsidianBot.obsidian, geodeBot.obsidian),
    },
  } as Blueprint
})

console.log(blueprints)

type Inventory = {
  [key in Resource]: number
} & {
  bots: Robot[]
}

const startInventory: Inventory = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
  bots: [
    {
      ore: 0,
      clay: 0,
      obsidian: 0,
      resource: 'ore',
    },
  ],
}

const blueprintQuality = (blueprint: Blueprint, time: number, inv: Inventory, seen: Map<string, number>) => {
  if (time <= 0) return inv.geode

  const key = `${inv.ore},${inv.clay},${inv.obsidian},${inv.geode}`
  if (seen.has(key)) {
    return seen.get(key)!
  }

  const geodeBots = inv.bots.filter((b) => b.resource === 'geode').length

  let maxVal = inv.geode + geodeBots * time

  for (let i = 0; i < blueprint.bots.length; i++) {
    const bot = blueprint.bots[i]
    const botInInv = inv.bots.filter((b) => b.resource === bot.resource).length
    const maxSpent = blueprint.maxSpent[bot.resource]
    if (botInInv >= maxSpent && bot.resource !== 'geode') continue

    let wait = 0
    const recipe = { ...bot }
    const entires = Object.entries(recipe) as [Resource, number][]

    loop: {
      for (const [resource, amount] of entires) {
        const botsWeHave = inv.bots.filter((b) => b.resource === resource).length
        if (botsWeHave === 0) {
          break loop
        }
        wait = Math.max(wait, Math.ceil((amount - inv[resource]) / botsWeHave))
      }

      const remTime = time - wait - 1
      if (remTime <= 0) continue

      const newResources = inv.bots.map((b) => {
        const resources = inv[bot.resource]
        const bots = inv.bots.filter((b) => b.resource === bot.resource).length
        return {
          [bot.resource]: resources + bots * (wait + 1),
        } as { [key in Resource]: number }
      })

      // Spend resources to make bots.
      for (const [resource, amount] of entires) {
        newResources.find((r) => r[resource] !== undefined)![resource] -= amount
      }
      const bots = inv.bots.map((b) => {
        if (b.resource === bot.resource) {
          return { ...b, ...bot }
        }
        return b
      })
    }
  }

  seen.set(key, maxVal)
  return maxVal
}
// Find the blueprint that produces the most geode in less than 24 minutes.
const qualities = blueprints.map((b) => {
  const seen = new Map<string, number>()
  const inv = { ...startInventory, bots: [...startInventory.bots] }
  const quality = blueprintQuality(b, 24, inv, seen)
  return { blueprint: b.id, quality }
})

console.log({ qualities })
