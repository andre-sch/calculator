document.onpaste = event => {
  const pastedValue = event.clipboardData.getData('text')
  if (!pastedValue) return

  const takeOutCommas = pastedValue.replace(/,/g, '')
  const isValid = validatePastedValue(takeOutCommas)
  if (!isValid) return errorMode.display('Invalid input')

  entry.current = Number(takeOutCommas) == 0 ? '0' : takeOutCommas
  entry.setNewAttributes()
  entry.showCurrent()
}

function validatePastedValue(value) {
  const withoutScientificExpression = value.replace(/e[-+]\d+/, '')
  if (withoutScientificExpression.length > 16) return false
  const numberOfDecimalPoints = withoutScientificExpression.match(/\./g) ?
  withoutScientificExpression.match(/\./g).length : 0
  const numberOfMinus = withoutScientificExpression.match(/-/g) ?
    withoutScientificExpression.match(/-/g).length : 0
    
  if (numberOfDecimalPoints > 1 || numberOfMinus > 1) return false
  
  const hasInvalidCharacter = /[^-\d\.]/.test(withoutScientificExpression)
  if (hasInvalidCharacter) return false
  else return true
}