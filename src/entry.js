const output = document.querySelector('.equation output')
const outputMeasure = document.querySelector('.output-measure')

const entry = {
  isNegativeNumber: false,
  isDecimalNumber: false,
  isOverwritingEnabled: false,
  previous: null,
  current: '0',
  toggleSign() {
    if (entry.current == '0') return
    entry.isNegativeNumber = !entry.isNegativeNumber
    entry.current = entry.current.startsWith('-')
      ? entry.current.slice(1)
      : '-' + entry.current
    entry.showCurrent()

    memory.hasBeenRecovered = false
  },
  addCharacter(character) {
    const MAX_LENGTH = 16
    const cleanedCurrentEntry = entry.current.replace(/[-\.]|(?<=\b)0\.|e.+/g, '')

    if (entry.isOverwritingEnabled) {
      entry.isOverwritingEnabled = false
      
      if (entry.previous != null) {
        operation.clearContentAfterSign()
      }
      else {
        if (operationContainer.textContent.includes('=')) {
          operation.setContainerTextContent('')
        }
        
        if (operation.hasMathFunction()) {
          calculatorHistory.addNewSave()
        }
      }

      if (character == '.') entry.current = '0.'
      else entry.current = character
      entry.setNewAttributes()
    }
    else {
      if (cleanedCurrentEntry.length == MAX_LENGTH) return

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
    outputMeasure.value = formattedCurrentEntry
    entry.adjustOutputFontSize()
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
  adjustOutputFontSize() {
    outputMeasure.style.fontSize = '2.25rem'
    var size = 225

    while (outputMeasure.offsetWidth > operation.getContainerWidth()) {
      size = size - 5
      outputMeasure.style.fontSize = (size / 100) + 'rem'
    }
    output.style.fontSize = (size / 100) + 'rem'
  },
  setNewAttributes() {
    if (entry.current.startsWith('-')) entry.isNegativeNumber = true
    else entry.isNegativeNumber = false

    if (entry.current.includes('.')) entry.isDecimalNumber = true
    else entry.isDecimalNumber = false
  },
  savePrevious() {
    entry.previous = Number(entry.current)
    entry.isOverwritingEnabled = true
  },
  clear() {
    entry.isNegativeNumber = false
    entry.isDecimalNumber = false
    entry.isOverwritingEnabled = false

    if (entry.previous) {
      operation.clearContentAfterSign()
    } else if (operationContainer.textContent.includes('=')) {
      operation.setContainerTextContent('')
    }

    entry.current = '0'
    entry.showCurrent()
  }
}