const defined = {
  'byte': ['UNSIGNED', 'CHAR'],
  'uchar': ['UNSIGNED', 'CHAR'],
  'ushort': ['UNSIGNED', 'SHORT'],
  'uint': ['UNSIGNED', 'INT'],
  'ulong': ['UNSIGNED', 'LONG'],
  'HANDLE': ['UNSIGNED', 'INT'],
  'string': ['CONST', 'CHAR', '*']
}

const isBlank = c => (c === ' ' || c === '\t' || c === '\r' || c === '\n')
const isDigit = c => (c >= '0' && c <= '9')
const isLetter = c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'
const isLetterOrDigit = c => isLetter(c) || isDigit(c)

class Tokens {
  constructor (toks) {
    this.tokens = toks
    this.i = 0
    this.t = this.tokens[this.i]
  }

  next () {
    this.t = this.tokens[++this.i]
    return this.t
  }

  expect (k, msg) {
    if (!this.t || this.t.key !== k) {
      if (!msg) msg = `expecting ${k}`
      throw Error(msg)
    }
  }
}

function parseTokens (s) {
  const tokens = []
  let cp = 0;
  for (;;) {
    const lastSize = tokens.length
    let isId = false
    let rcp = cp
    while (isBlank(s.charAt(rcp))) rcp++
    cp = rcp + 1
    const c = s.charAt(rcp++)
    if (c === '') {
      break
    }

    switch (c) {
      case ',':
      case '*':
      case '[':
      case ']':
      case '(':
      case ')':
        tokens.push({key: c})
        break
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9': {
        let n = 0
        let nextc = s.charAt(rcp)
        const orgi = rcp - 1
        if (c == '0' && (nextc == 'x' || nextc == 'X')) {
          let d = 0
          while (rcp + 1 < s.length) {
            nextc = s.charAt(++rcp)
            if (isDigit(nextc)) d = nextc.charCodeAt() - '0'.charCodeAt()
            else if (nextc >= 'a' && nextc <= 'f') d = nextc.charCodeAt() - 'a'.charCodeAt() + 10
            else if (nextc >= 'A' && nextc <= 'F') d = nextc.charCodeAt() - 'A'.charCodeAt() + 10
            else  break

            n = (n<<4) + d
          }
          if (rcp - orgi <= 2) throw Error(`invalid hex format ${s.slice(orgi, rcp)}`)
        } else {
          for (n = c.charCodeAt() - '0'.charCodeAt(); isDigit(s.charAt(rcp)); ) {
            let d = s.charCodeAt(rcp++) - '0'.charCodeAt()
            n = 10 * n + d
          }
        }

        cp = rcp
        tokens.push({key: 'ICON', value: n})
        break
      }
      case 'i':
        if (s.charAt(rcp) === 'n' &&
          s.charAt(rcp + 1) === 't' &&
          !isLetterOrDigit(s.charAt(rcp + 2))) {
          cp = rcp + 2
          tokens.push({key: 'INT', kind: 'CHAR'})
          break
        }
        break
      case 'c':
        if (s.charAt(rcp) === 'h' &&
          s.charAt(rcp + 1) === 'a' &&
          s.charAt(rcp + 2) === 'r' &&
          !isLetterOrDigit(s.charAt(rcp + 3))) {
          cp = rcp + 3
          tokens.push({key: 'CHAR', kind: 'CHAR'})
          break
        }
        if (s.charAt(rcp) === 'o' &&
          s.charAt(rcp + 1) === 'n' &&
          s.charAt(rcp + 2) === 's' &&
          s.charAt(rcp + 3) === 't' &&
          !isLetterOrDigit(s.charAt(rcp + 4))) {
          cp = rcp + 4
          tokens.push({key: 'CONST', kind: 'CHAR'})
          break
        }
        break
      case 'd':
        if (s.charAt(rcp) === 'o' &&
          s.charAt(rcp + 1) === 'u' &&
          s.charAt(rcp + 2) === 'b' &&
          s.charAt(rcp + 3) === 'l' &&
          s.charAt(rcp + 4) === 'e' &&
          !isLetterOrDigit(s.charAt(rcp + 5))) {
          cp = rcp + 5
          tokens.push({key: 'DOUBLE', kind: 'CHAR'})
          break
        }
        break
      case 'f':
        if (s.charAt(rcp) === 'l' &&
          s.charAt(rcp + 1) === 'o' &&
          s.charAt(rcp + 2) === 'a' &&
          s.charAt(rcp + 3) === 't' &&
          !isLetterOrDigit(s.charAt(rcp + 4))) {
          cp = rcp + 4
          tokens.push({key: 'FLOAT', kind: 'CHAR'})
          break
        }
        break
      case 'l':
        if (s.charAt(rcp) === 'o' &&
          s.charAt(rcp + 1) === 'n' &&
          s.charAt(rcp + 2) === 'g' &&
          !isLetterOrDigit(s.charAt(rcp + 3))) {
          cp = rcp + 3
          tokens.push({key: 'LONG', kind: 'CHAR'})
          break
        }
        break
      case 's':
        if (s.charAt(rcp) === 'h' &&
          s.charAt(rcp + 1) === 'o' &&
          s.charAt(rcp + 2) === 'r' &&
          s.charAt(rcp + 3) === 't' &&
          !isLetterOrDigit(s.charAt(rcp + 4))) {
          cp = rcp + 4
          tokens.push({key: 'SHORT', kind: 'CHAR'})
          break
        }
        if (s.charAt(rcp) === 'i' &&
          s.charAt(rcp + 1) === 'g' &&
          s.charAt(rcp + 2) === 'n' &&
          s.charAt(rcp + 3) === 'e' &&
          s.charAt(rcp + 4) === 'd' &&
          !isLetterOrDigit(s.charAt(rcp + 5))) {
          cp = rcp + 5
          tokens.push({key: 'SIGNED', kind: 'CHAR'})
          break
        }
        break
      case 'u':
        if (s.charAt(rcp) === 'n' &&
          s.charAt(rcp + 1) === 's' &&
          s.charAt(rcp + 2) === 'i' &&
          s.charAt(rcp + 3) === 'g' &&
          s.charAt(rcp + 4) === 'n' &&
          s.charAt(rcp + 5) === 'e' &&
          s.charAt(rcp + 6) === 'd' &&
          !isLetterOrDigit(s.charAt(rcp + 7))) {
          cp = rcp + 7
          tokens.push({key: 'UNSIGNED', kind: 'CHAR'})
          break
        }
        break
      case 'v':
        if (s.charAt(rcp) === 'o' &&
          s.charAt(rcp + 1) === 'i' &&
          s.charAt(rcp + 2) === 'd' &&
          !isLetterOrDigit(s.charAt(rcp + 3))) {
          cp = rcp + 3
          tokens.push({key: 'VOID', kind: 'CHAR'})
          break
        }
        break
      default:
        cp = rcp
        break
    }

    if (lastSize == tokens.length) {
      if (isLetter(c)) {
        const iStart = rcp - 1
        while (isLetterOrDigit(s.charAt(rcp))) rcp++
        const token = s.slice(iStart, rcp)
        cp = rcp
        if (token in defined) {
          for (const key of defined[token]) {
            tokens.push({key, kind: 'CHAR'})
          }
        } else {
          tokens.push({key: 'ID', id: token})
        }
      } else {
        throw Error(`illegal character ${c}`)
      }
    }
  }

  tokens.push({key: 'EOI'})

  return new Tokens(tokens)
}

function parseDeclare (s) {
  const tokens = parseTokens(s)

  if (!tokens.t || tokens.t.kind !== 'CHAR') throw Error('invalid function signature')

  const ty = specifier(tokens)

  if (tokens.t.key === 'ID' || tokens.t.key === '*') {
    return dclr(ty, tokens, 0)
  }
}

function specifier (tokens) {
  const mark = {}

  for (;;) {
    let p = ''
    let tt = tokens.t.key
    switch (tokens.t.key) {
      case 'CONST': p = 'cons'; tokens.next(); break
      case 'SIGNED':
		  case 'UNSIGNED': p = 'sign'; tokens.next(); break
      case 'LONG':
        if (mark.type === 'LONG') {
          mark.type = undefined
          tt = 'LONGLONG'
        }
      case 'SHORT':
      case 'VOID': 
      case 'CHAR': 
      case 'INT':
      case 'FLOAT':
      case 'DOUBLE':
        p = 'type'
        tokens.next()
        break
      default: p = ''; break
    }

    if (p === '') break
		if (mark[p]) throw Error(`invalid use of ${tt}`)
		mark[p] = tt
  }

  if (!mark['type']) {
    mark['type'] = 'INT'
  }

  const cons = !!mark.cons
  if (mark.sign === 'UNSIGNED') {
    return {type: 'UNSIGNED ' + mark.type, cons}
  } else {
    return {type:  mark.type, cons}
  }
}

function dclr (basety, tokens, level) {
  let [ty, id, params] = dclr1(tokens, level)
  for (; ty; ty = ty.base) {
    switch (ty.type) {
      case 'POINTER':
        basety = {type: 'POINTER', base: JSON.parse(JSON.stringify(basety))}
        break
      case 'ARRAY':
        basety = {type: 'ARRAY', base: JSON.parse(JSON.stringify(basety)), dim: ty.dim}
        break
    }
  }

  basety.id = id
  if (params) basety.params = params

  return basety
}

function dclr1 (tokens, level) {
  let id = null
  let params = null
  let ty = null

  switch (tokens.t.key) {
    case 'ID':
      id = tokens.t.id
      tokens.next()
      break
    case '*':
      tokens.next()
      while (tokens.t.key === 'CONST') tokens.next()
      let bty
      [bty, id, params] = dclr1(tokens, level)
      ty = {type: 'POINTER', base: bty}
      return [ty, id, params]
    default:
      return [null, id, params]
  }

  if (level === 0) {
    tokens.expect('(')
    tokens.next()
    params = parameters(tokens, level + 1)
  } else {
    while (tokens.t.key === '[') {
      tokens.next()
      let n = 0
      if (tokens.t.key === 'ICON') {
        n = tokens.t.value
        tokens.next()
      }
      tokens.expect(']')
      tokens.next()

      if (ty && ty.type === 'ARRAY') ty.dim = ty.dim * n
      else ty = {type: 'ARRAY', dim: n, base: JSON.parse(JSON.stringify(ty))}
    }
  }

  return [ty, id, params]
}

function parameters (tokens, level) {
  const list = []
  if (tokens.t.kind === 'CHAR') {
    let n = 0
    let ty1
    for (;;) {
      let ty
      if (tokens.t.kind !== 'CHAR') throw Error('missing parameter type')
      n++
      ty = dclr(specifier(tokens), tokens, level)
      if ( ty.type === 'VOID' && (ty1 || ty.id)
			||  (ty1 && ty1.type == 'VOID'))
        throw Error('illegal formal parameter types')
      if (!ty.id)
        ty.id = '' + n
      if (ty.type !== 'VOID') {
        list.push(ty)
      }
      if (!ty1) ty1 = ty
      if (tokens.t.key !== ',') {
        break
      }
      tokens.next()
    }
  }

  tokens.expect(')')
  tokens.next()
  tokens.expect('EOI')

  return list
}

module.exports = {
  parseDeclare
}
