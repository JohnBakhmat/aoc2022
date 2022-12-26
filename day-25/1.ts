export {}

const text = await Deno.readTextFile('input.txt')

/*
SNAFU system
"=" is a "-2"
"-" is a "-1"

each digit represents 

Decimal          SNAFU
        1              1
        2              2
        3             1=
        4             1-
        5             10
        6             11
        7             12
        8             2=
        9             2-
       10             20
       15            1=0
       20            1-0
     2022         1=11-2
    12345        1-0---0
314159265  1121-1110-1=0
*/

const lines = text
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)

const maxLength = Math.max(...lines.map(line => line.length))

const linePad = lines.map(line => line.padStart(maxLength, '0'))

console.log(linePad)

const sum = linePad.reduce((a, c) => snafuSum(a, c))

function snafuSum(acc: string, line: string): string {
  if (acc.length !== line.length) {
    const maxLength = Math.max(acc.length, line.length)
    line = line.padStart(maxLength, '0')
    acc = acc.padStart(maxLength, '0')
  }

  const result = []
  const lineAr = line.split('').reverse()
  const accAr = acc.split('').reverse()

  for (let i = 0; i < line.length; i++) {
    const lineDigit = snafuDigitToDecimal(lineAr[i])
    const accDigit = snafuDigitToDecimal(accAr[i])

    const sum = lineDigit + accDigit

    if (sum > 2) {
    }
  }

  return acc
}

function snafuDigitToDecimal(digit: string): number {
  const obj: {
    [key: string]: number
  } = {
    '1': 1,
    '2': 2,
    '-': -1,
    '=': -2,
    '0': 0,
  }
  return obj[digit]
}

function decimalDigitToSnafu(n: number): string {
  const obj: {
    [key: string]: number
  } = {
    '1': 1,
    '2': 2,
    '-': -1,
    '=': -2,
    '0': 0,
  }
  return Object.keys(obj).find(key => obj[key] === n)!
}
