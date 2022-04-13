const operationContainer = document.querySelector('.operation')

const operation = {
  matchContentAfterSign: /(?<=\s[-+×÷]).+/,
  mathFunctions: {
    multiplicativeInverse() {
      if (Number(entry.current) == 0) {
        operationContainer.textContent = '1/( 0 )'
        errorMode.display('Cannot divide by zero')
        return
      }
      this.display('1/')
  
      const result = 1 / Number(entry.current)
      operation.end(result)
      entry.isOverwritingEnabled = true
    },
    square() {
      this.display('sqr')
      
      const result = Number(entry.current) ** 2
      operation.end(result)
      entry.isOverwritingEnabled = true
    },
    squareRoot() {
      this.display('√')
  
      if (entry.current.startsWith('-')) {
        errorMode.display('Invalid input')
        return
      }
  
      const result = Math.sqrt(Number(entry.current))
      operation.end(result)
      entry.isOverwritingEnabled = true
    },
    negate() {
      if (entry.isOverwritingEnabled) {
        this.display('negate')
      }
      entry.toggleSign()
    },
    display(mathFunction) {
      if (entry.previous == null) {
        if (entry.isOverwritingEnabled && !operationContainer.textContent.includes('=')) {
          operationContainer.textContent = `${mathFunction}( ${operationContainer.textContent} )`
        } else {
          operationContainer.textContent = `${mathFunction}( ${Number(entry.current)} )`
        }
      }
      else {
        const matchContent = operationContainer.textContent
          .match(operation.matchContentAfterSign)
        const withoutContentAfterSign = operationContainer.textContent
          .replace(operation.matchContentAfterSign, '')

        if (matchContent) {
          var newContentAfterSign = ` ${mathFunction}(${matchContent[0]} )`
        }
        else {
          var newContentAfterSign = ` ${mathFunction}( ${Number(entry.current)} )`
        }
        operationContainer.textContent = withoutContentAfterSign + newContentAfterSign
      }
    }
  },
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