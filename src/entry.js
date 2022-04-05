const output = document.querySelector('.equation output')
var isNegativeNumber = false
var isDecimalNumber = false
var currentEntry = '0'

function addCharacter(character) {
  const MAX_LENGTH = 16
  const cleanedCurrentEntry = currentEntry
    .replace(/[-\.]|(?<=\b)0/g, '')

  if (cleanedCurrentEntry.length == MAX_LENGTH) return
  if (isDecimalNumber && character == '.') return

  if (currentEntry == '0' && character != '.') currentEntry = character
  else currentEntry = currentEntry + character
  showCurrentEntry()
}
function removeCharacter() {
  const newCharacters = currentEntry.split('')

  const removedCharacter = newCharacters.pop()
  if (removedCharacter == '.') isDecimalNumber = false

  switch (newCharacters.join('')) {
    case '':
    case '-':
    case '-0':
      currentEntry = '0'
      isNegativeNumber = false
      break
    default:
      currentEntry = newCharacters.join('')
  }
  showCurrentEntry()
}

function oppositeOfCurrentEntry() {
  if (currentEntry == '0') return
  isNegativeNumber = !isNegativeNumber
  currentEntry = `${-(Number(currentEntry))}`
  showCurrentEntry()
}

function showCurrentEntry() {
  const formattedCurrentEntry = addThousandsSeparator()
  output.value = formattedCurrentEntry 
}

function addThousandsSeparator() {
  const separator = ','
  let charactersToSeparate

  if (currentEntry.includes('.')) {
    var [wholePart, decimalPart] = currentEntry.split('.')
    charactersToSeparate = wholePart.split('')
    isDecimalNumber = true
  } else charactersToSeparate = currentEntry.split('')

  if (isNegativeNumber) charactersToSeparate.shift()

  const FIRST_DIGIT = 1
  const numberOfDigits = charactersToSeparate.length
  const numberOfSeparators = Math.floor(
    (numberOfDigits - FIRST_DIGIT) / 3
  )

  const reversedCharacters = charactersToSeparate.reverse()
  let index = numberOfSeparators
  while (index > 0) {
    reversedCharacters.splice(3 * index, 0, separator)
    index = index - 1
  }

  const charactersWithSeparator = reversedCharacters.reverse()
  if (isNegativeNumber) charactersWithSeparator.unshift('-')

  let formattedCurrentEntry = charactersWithSeparator.join('')
  if (isDecimalNumber) formattedCurrentEntry += `.${decimalPart}`

  return formattedCurrentEntry
}

function clearEntry() {
  isNegativeNumber = false
  isDecimalNumber = false
  currentEntry = '0'
  showCurrentEntry()
}