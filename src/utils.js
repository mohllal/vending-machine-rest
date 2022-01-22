const prettify = (str) => str.startsWith('-') ? { [str.slice(1)]: -1 } : { [str]: 1 }

export const sortQ = (value) => value
  ? value.split
    ? value.split(',').reduce((a, v) => {
      v = prettify(v)
      return { ...a, ...v }
    }, {})
    : prettify(value)
  : {}
