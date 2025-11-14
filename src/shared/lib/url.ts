export function getAbsoluteIconPath(base: string | undefined, rel?: string) {
  if (!rel) return undefined
  if (/^https?:\/\//i.test(rel)) return rel
  if (!base) return undefined
  const b = base.replace(/\/+$/, '')
  const r = rel.replace(/^\/+/, '')
  return `${b}/${r}`
}
