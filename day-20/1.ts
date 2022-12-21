export {}
const text = await Deno.readTextFile('input.txt')

const key = 811589153
let array = text
  .split('\n')
  .map(Number)
  .map((n) => ({
    moved: false,
    value: n,
  }))

const swap = (i: number, j: number) => {
  const temp = array[i]
  array[i] = array[j]
  array[j] = temp
}

const getCircularIndex = (i: number) => {
  return ((i % array.length) + array.length) % array.length
}

const swapForward = (value: { moved: boolean; value: number }) => {
  const i = array.findIndex((v) => v.value === value.value && !v.moved)
  if (i === -1) return
  for (let j = 0; j < value.value; j++) {
    const a = getCircularIndex(i + j)
    const b = getCircularIndex(i + j + 1)
    swap(a, b)
    array[i].moved = true
  }
}
const swapBackward = (value: { moved: boolean; value: number }) => {
  const i = array.findIndex((v) => v.value === value.value && !v.moved)
  if (i === -1) return
  for (let j = 0; j < Math.abs(value.value); j++) {
    const a = getCircularIndex(i - j)
    const b = getCircularIndex(i - j - 1)
    swap(a, b)
    array[i].moved = true
  }
}
const persistArray = [...array]

persistArray.forEach((value, i) => {
  if (value.value > 0) {
    swapForward(value)
  } else {
    swapBackward(value)
  }
})

const zeroIndex = array.indexOf({
  moved: false,
  value: 0,
})

const thousandth = array[getCircularIndex(zeroIndex + 1000)]
const twoThousandth = array[getCircularIndex(zeroIndex + 2000)]
const threeThousandth = array[getCircularIndex(zeroIndex + 3000)]

console.log(array, {
  thousandth,
  twoThousandth,
  threeThousandth,
  sum: thousandth.value + twoThousandth.value + threeThousandth.value,
})
