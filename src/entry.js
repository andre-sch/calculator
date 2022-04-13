const output = document.querySelector('.equation output')

const entry = {
  isNegativeNumber: false,
  isDecimalNumber: false,
  isOverwritingEnabled: false,
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
    const cleanedCurrentEntry = entry.current.replace(/[-\.]|(?<=\b)0\.|e.+/g, '')

    if (cleanedCurrentEntry.length == MAX_LENGTH) return
    
    if (entry.isOverwritingEnabled) {
      entry.isOverwritingEnabled = false

      if (character == '.') entry.current = '0.'
      else entry.current = character
      entry.setNewAttributes()
      
      if (entry.previous != null) {
        const withoutContentAfterSign = operationContainer.textContent
          .replace(operation.matchContentAfterSign, '')

        operationContainer.textContent = withoutContentAfterSign
      } else if (operationContainer.textContent.includes('=')) {
        operationContainer.textContent = ''
      }
    }
    else {
      if (character == '.') {
        if (entry.isDecimalNumber) return 
        else entry.isDecimalNumber = true
        entry.current = entry.current + '.'
      }
      else {
        if (entry.current == '0') entry.current = character
        else entry.current = entry.current + character
      }
    }
    entry.showCurrent()
  },
  removeCharacter() {
    if (entry.isOverwritingEnabled) return

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
  },
  setNewAttributes() {
    if (entry.current.startsWith('-')) entry.isNegativeNumber = true
    else entry.isNegativeNumber = false

    if (entry.current.includes('.')) entry.isDecimalNumber = true
    else entry.isDecimalNumber = false
  }
}