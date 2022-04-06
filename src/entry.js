const output = document.querySelector('.equation output')

const entry = {
  isNegativeNumber: false,
  isDecimalNumber: false,
  current: '0',
  toggleSign() {
    if (entry.current == '0') return
    entry.isNegativeNumber = !entry.isNegativeNumber
    entry.current = entry.current.startsWith('-')
      ? entry.current.slice(1)
      : '-' + entry.current
    entry.showCurrent()
  },
  addCharacter(character) {
    const MAX_LENGTH = 16
    const cleanedCurrentEntry = entry.current.replace(/[-\.]|(?<=\b)0/g, '')
  
    if (cleanedCurrentEntry.length == MAX_LENGTH) return
    if (character == '.') {
      if (entry.isDecimalNumber) return 
      else entry.isDecimalNumber = true
    }
  
    if (entry.current == '0' && character != '.') entry.current = character
    else entry.current = entry.current + character

    entry.showCurrent()
  },
  removeCharacter() {
    const entryCharacters = entry.current.split('')
  
    const removedCharacter = entryCharacters.pop()
    if (removedCharacter == '.') entry.isDecimalNumber = false
  
    switch (entryCharacters.join('')) {
      case '':
      case '-':
      case '-0':
        entry.current = '0'
        entry.isNegativeNumber = false
        break
      default:
        entry.current = entryCharacters.join('')
    }
    entry.showCurrent()
  },
  showCurrent() {
    const formattedCurrentEntry = entry.addThousandsSeparator()
    output.value = formattedCurrentEntry 
  },
  addThousandsSeparator() {
    if (entry.current.includes('e')) return entry.current

    const separator = ','
    var charactersToSeparate = entry.current.split('')
  
    if (entry.current.includes('.')) {
      var [wholePart, decimalPart] = entry.current.split('.')
      charactersToSeparate = wholePart.split('')
    }
  
    if (entry.isNegativeNumber) charactersToSeparate.shift()
  
    const FIRST_DIGIT = 1
    const numberOfDigits = charactersToSeparate.length
    const numberOfSeparators = Math.floor(
      (numberOfDigits - FIRST_DIGIT) / 3
    )
  
    charactersToSeparate.reverse()
    let index = numberOfSeparators
    while (index > 0) {
      charactersToSeparate.splice(3 * index, 0, separator)
      index = index - 1
    }
    const separatedCharacters = charactersToSeparate.reverse()
    if (entry.isNegativeNumber) separatedCharacters.unshift('-')

    var formattedCurrentEntry = separatedCharacters.join('')
    if (entry.isDecimalNumber) formattedCurrentEntry += `.${decimalPart || ''}`
    return formattedCurrentEntry
  },
  clear() {
    entry.isNegativeNumber = false
    entry.isDecimalNumber = false
    entry.current = '0'
    entry.showCurrent()
  }
}