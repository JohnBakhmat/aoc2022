export {}

const text = await Deno.readTextFile('input.txt')
const map = new Map<string, string>()

text.split('\n').forEach((line) => {
  const [key, value] = line.split(':')
  map.set(key, `(${value})`)
})

const loop = () => {
  for (let i = 0; true; i++) {
    console.log(i)
    const root = map.get('root')!
    const opertands = root.split(/[+-/*]/g)!.map((opertand) => opertand.match(/\w+/g)![0])

    opertands.forEach((opertand) => {
      if (opertand.match(/\d+/g)) return
      const value = map.get(opertand)!
      map.set('root', root.replace(opertand, value).replaceAll(' ', ''))
    })

    const hasLetters = map.get('root')!.match(/[a-z]/)
    if (!hasLetters) return i
  }
}

console.log(loop())
console.log({ root: map.get('root')!, result: eval(map.get('root')!) })

// const result = eval(map.get('root')!)
// console.log({ result })
