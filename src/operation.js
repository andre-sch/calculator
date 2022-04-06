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
    this.displayResult(result)
  },
  square() {
    operationDisplay.textContent =
      `sqr( ${operationDisplay.textContent || entry.current} )`
    
    const result = Number(entry.current) ** 2
    this.displayResult(result)
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
    this.displayResult(result)
  },
  displayResult(result) {
    entry.current = result.toString().length > 16
      ? result.toPrecision(16)
      : result.toString()

    entry.setNewAttributes()
    entry.showCurrent()
  }
}