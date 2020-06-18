const classNames = (names: object) => {
  let str = ''
  Object.keys(names).forEach((name, index) => {
    if (names[name]) {
      if (str) {
        str += ` ${name}`
      } else {
        str = name
      }
    }
  })

  return str
}

export default classNames
