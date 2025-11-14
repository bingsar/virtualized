export function toRoman(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return String(n)
  n = Math.floor(n)
  const map: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let num = n
  let res = ''
  for (const [val, sym] of map) {
    while (num >= val) {
      res += sym
      num -= val
    }
    if (!num) break
  }
  return res
}
