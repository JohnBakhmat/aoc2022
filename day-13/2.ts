export {}
export {}
import _ from 'npm:lodash'

type Packet = Array<number[] | number | Packet>
const compare = (aPac: Packet, bPac: Packet): number => {
  for (let i = 0; i < aPac.length; i++) {
    if (i >= bPac.length) return 1

    const a = aPac[i]
    const b = bPac[i]

    if (!Array.isArray(a) && !Array.isArray(b)) {
      if (a !== b) return a - b
    }

    if (Array.isArray(a) && !Array.isArray(b)) {
      const result = compare(a, [b])
      if (result !== 0) return result
    }

    if (!Array.isArray(a) && Array.isArray(b)) {
      const result = compare([a], b)
      if (result !== 0) return result
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      const result = compare(a, b)
      if (result !== 0) return result
    }
  }
  return aPac.length < bPac.length ? -1 : 0
}
const expected = 140
const dividerPackets = [[[2]], [[6]]]
const text = (await Deno.readTextFile('input.txt'))
  .split('\n\n')
  .map((pair) => {
    const [a, b] = pair.split('\n')
    return [eval(a), eval(b)]
  })
  .flat()

text.push(...dividerPackets)
text.sort(compare)

const result = dividerPackets.map((value) => text.indexOf(value) + 1).reduce((acc, value) => acc * value, 1)

console.log({ result, expected })
