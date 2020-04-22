/* eslint-disable sort-keys */
export default {
  "S": { pattern: /[a-zA-Z]/u },
  "A": {
    pattern: /[a-zA-Z]/u,
    transform: (el) => String(el).toLocaleUpperCase()
  },
  "a": {
    pattern: /[a-zA-Z]/u,
    transform: (el) => String(el).toLocaleLowerCase()
  },
  "Y": {
    pattern: /[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/u,
    transform: (el) => String(el).toLocaleUpperCase()
  },
  "y": {
    pattern: /[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/u,
    transform: (el) => String(el).toLocaleLowerCase()
  },
  "X": { pattern: /[a-zA-Z0-9]/u },
  "#": { pattern: /[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/u },
  "0": { pattern: /\d/u },
  "9": {
    pattern: /\d/u,
    optional: true
  },
  "?": {
    nextElement: true,
    optional: true
  },
  "!": {
    nextElement: true,
    noMask: true
  }
};