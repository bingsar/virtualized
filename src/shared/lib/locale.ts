export const LOCALE = 'en'

type LocaleMap = Record<string, string>

export const getDisplayName = (v: { name: string; localization?: { shortmark?: LocaleMap } }) =>
  v.localization?.shortmark?.[LOCALE] ?? v.name

export const getDescription = (v: { localization?: { description?: LocaleMap } }) => {
  const descriptions = v.localization?.description
  if (!descriptions) return undefined
  return descriptions[LOCALE] ?? descriptions.en ?? Object.values(descriptions)[0]
}
