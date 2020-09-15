type returnVal = (obj: { [key: string]: any }) => boolean

export const PropEq = (prop: string, value): returnVal => (obj) => obj[prop] === value
