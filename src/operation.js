const operationDisplay = document.querySelector('.operation')

const operation = {
  multiplicativeInverse() {
    if (entry.current == '0') {
      operationDisplay.textContent = '1/( 0 )'
      output.value = 'Cannot divide by zero'
      errorMode.display()
      return
    }
    operationDisplay.textContent =
    `1/( ${operationDisplay.textContent || entry.current} )`

    const result = 1 / Number(entry.current)
    // this.displayResult(result)
  },
  square() {
    operationDisplay.textContent =
      `sqr( ${operationDisplay.textContent || entry.current} )`
    
    const result = Number(entry.current) ** 2
    // this.displayResult(result)
  },
  squareRoot() {
    operationDisplay.textContent =
      `√( ${operationDisplay.textContent || entry.current} )`

    if (entry.current.includes('-')) {
      output.value = 'Invalid input'
      errorMode.display()
      return
    }

    const result = Math.sqrt(Number(entry.current))
    // this.displayResult(result)
  },
  end(result) {
    entry.current = operation.formatResult(result)
    entry.setNewAttributes()
    entry.showCurrent()
  },
  formatResult(result) {
    const cleanedResult = result.toString().replace(/[-\.]|(?<=\b)0\./g, '')
    var trailingZerosAfterDecimalPoint = result.toString().match(/\.(0+)/) ?
      result.toString().match(/\.(0+)/)[1] : ''

    if (cleanedResult.length > 16) {
      if (result.toString().includes('e')) {
        const trailingZeros = /0+(?=e)/
        return result.toExponential(15).replace(trailingZeros, '')
      }
      else {
        const trailingZeros = /(?<=\..*?)0+$/
        return result
          .toPrecision(16 - trailingZerosAfterDecimalPoint.length)
          .replace(trailingZeros, '')
      }
    } else return result.toString()
  }
}