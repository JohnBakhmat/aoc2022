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
    ore: number
    clay: number
    obsidian: number
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

const timeLimit = 24 // minutes

const blueprintQuality = (blueprint: Blueprint) => {
  const inv = { ...startInventory, bots: [...startInventory.bots] }

  let timeSpent = 0

  while (timeSpent < timeLimit) {
    console.log('Minute ' + timeSpent)
    console.log({ ...inv, bots: inv.bots.map((b) => b.resource) })

    //Count production speed
    const productionSpeed = new Map<Resource, number>()
    inv.bots.forEach((bot) => {
      productionSpeed.set(bot.resource, (productionSpeed.get(bot.resource) || 0) + 1)
    })

    console.log({ productionSpeed })

    // Produce bots
    // Check what is the most expensive bot we can produce
    const mostExpensiveBot = blueprint.bots.reduce((mostExpensive, bot) => {
      //if we have resources to produce a bot
      if (inv.ore >= bot.ore && inv.clay >= bot.clay && inv.obsidian >= bot.obsidian) {
        return bot.resource
      }
      return mostExpensive
    }, 'none' as Resource | 'none')

    // Start bot production
    if (mostExpensiveBot !== 'none') {
      console.log('Producing ' + mostExpensiveBot + ' bot')
      // Produce the most expensive bot
      // Remove resources
      inv.ore -= blueprint.bots.find((b) => b.resource === mostExpensiveBot)!.ore
      inv.clay -= blueprint.bots.find((b) => b.resource === mostExpensiveBot)!.clay
    }

    //Collect resources
    inv.bots.forEach((bot) => {
      inv[bot.resource] += 1
    })
    console.log(
      'Collected resources: ' +
        JSON.stringify({
          ore: inv.ore,
          clay: inv.clay,
          obsidian: inv.obsidian,
          geode: inv.geode,
        }),
    )

    // Finish bot production
    if (mostExpensiveBot !== 'none') {
      // Add bot to inventory
      // Add bot
      inv.bots.push({
        ore: 0,
        clay: 0,
        obsidian: 0,
        resource: mostExpensiveBot,
      })
      console.log('Finished' + mostExpensiveBot + ' bot production.')
    }

    console.log('\n\n\n')

    timeSpent += 1
  }

  return inv.geode
}
// Find the blueprint that produces the most geode in less than 24 minutes.
const qualities = blueprints.map((b) => blueprintQuality(b))

console.log({ qualities })
