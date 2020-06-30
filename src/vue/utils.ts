const log = console.log.bind(console)

const isType = type => {
  return data => Object.prototype.toString.call(data) === `[object ${type}]`
}

const isObject = isType('Object')
const isArray = isType('Array')
const isNumber = isType('Array')
const isString = isType('String')

const throwError = (...args) => {
  throw new Error(args.join(' '))
}

const replaceAll = (str: string, s1: string, s2:string): string => {
  let reg = new RegExp(s1, 'g')
  return str.replace(reg, s2)
}

const onload = () : Promise<void> => {
  return new Promise((resolve, reject) => {
    window.onload = () => {
      resolve()
    }
  })
}

export {
  log,
  isType,
  isObject,
  throwError,
  replaceAll,
  onload
}