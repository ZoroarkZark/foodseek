export const toTitleCase = (str) => {
  return str.replace(/\b(\w)/g, k => k.toUpperCase())
}

