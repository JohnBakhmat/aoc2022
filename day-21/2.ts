export {}

const text = await Deno.readTextFile('input.txt')
const ogMap = new Map<string, string>()

text.split('\n').forEach((line) => {
  const [key, value] = line.split(':')
  ogMap.set(key, `(${value})`)
})

let map = new Map(ogMap)

function solveFor(key: string) {
  for (let i = 0; i < 100000; i++) {
    console.log(i)
    const root = map.get(key)!
    const opertands = root.split(/[+-/*]/g)!.map((opertand) => opertand.match(/\w+/g)![0])

    opertands.forEach((opertand) => {
      if (opertand.match(/\d+/g)) return
      if (opertand.includes('humn')) return
      const value = map.get(opertand)!
      map.set(key, root.replace(opertand, value).replaceAll(' ', ''))
    })

    const hasLetters = map.get(key)!.replaceAll(/[0-9\(\)+*-\/]|humn/g, '')
    if (!hasLetters) return map.get(key)
  }
}

const root = map.get('root')!
const left = root.split(/[*+-/]/)[0].match(/\w+/g)![0]
const right = root.split(/[*+-/]/)[1].match(/\w+/g)![0]
const leftR = solveFor(left)
// console.log(leftR)
const rightR = solveFor(right)
// console.log(rightR)

for (let i = 3247317268284; true; i++) {
  console.log('HUMN: ', i.toLocaleString())
  const l = leftR!.replaceAll('humn', i.toString())
  const r = rightR!.replaceAll('humn', i.toString())

  if (eval(l) === eval(r)) {
    console.log({
      result: i,
    })
    break
  }
}
//2 838 740
//3 002 521 977
const b = 48165982835110
