const operationContainer = document.querySelector('.operation')

const operation = {
  last: '',
  basic: {
    addition: {
      sign: '+',
      execute: (a, b) => a + b
    },
    subtraction: {
      sign: '-',
      execute: (a, b) => a - b
    },
    multiplication: {
      sign: '×',
      execute: (a, b) => a * b
    },
    division: {
      sign: '÷',
      execute: (a, b) => a / b
    }
  },
  mathFunctions: {
    multiplicativeInverse() {
      if (Number(entry.current) == 0) {
        operation.setContainerTextContent('1/( 0 )')
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
        if (
          entry.isOverwritingEnabled &&
          !operationContainer.textContent.includes('=') &&
          !memory.hasBeenRecovered
        ) {
          operation.setContainerTextContent(`${mathFunction}( ${operationContainer.textContent} )`)
        } else {
          operation.setContainerTextContent(`${mathFunction}( ${Number(entry.current)} )`)
        }
      }
      else {
        const contentAfterSign = operation.getContentAfterSign(operationContainer.textContent)
        operation.clearContentAfterSign()

        if (contentAfterSign) {
          var newContentAfterSign = ` ${mathFunction}(${contentAfterSign} )`
        }
        else {
          var newContentAfterSign = ` ${mathFunction}( ${Number(entry.current)} )`
        }
        operation.setContainerTextContent(operationContainer.textContent + newContentAfterSign)
      }
    }
  },
  getSign() {
    const regex = /\s[-+×÷]($|\s)/

    const sign = regex.test(operationContainer.textContent) ?
      operationContainer.textContent.match(regex)[0].trim() : ''

    return sign
  },
  getNameOfBasic(sign) {
    for (const operationName in operation.basic) {
      if (operation.basic[operationName].sign == sign) return operationName
    }
    return ''
  },
  getContentAfterSign(operationText) {
    return operationText.match(/\s[-+×÷]\s(.+)/) ?
      operationText.match(/\s[-+×÷]\s(.+)/)[1] : ''
  },
  hasMathFunction: () => /\(.*?\)/.test(operationContainer.textContent),
  hasContentAfterSign: () => /\s[-+×÷]\s(.+)/.test(operationContainer.textContent),
  clearContentAfterSign() {
    const contentAfterSign = operation.getContentAfterSign(operationContainer.textContent)
    operation.setContainerTextContent(
      operationContainer.textContent.replace(contentAfterSign, '')
    )
  },
  percentage() {
    var operationName, relativeValue
    const sign = operation.getSign()

    if (entry.previous == null) {
      if (sign) {
        operationName = operation.getNameOfBasic(sign)
        relativeValue = Number(entry.current)
      } else {
        entry.clear()
        operation.setContainerTextContent('0')
        return
      }
    }
    else {
      operationName = operation.last
      relativeValue = entry.previous
  
      operation.clearContentAfterSign()
      operationContainer.textContent += ' '
    }
    const isPercentageRelativeToPreviousEntry =
      ['addition', 'subtraction'].includes(operationName)

    const result =
      (isPercentageRelativeToPreviousEntry ? relativeValue : 1) *
      (Number(entry.current) / 100)

    operation.end(result)
    entry.isOverwritingEnabled = true

    if (operationContainer.textContent.includes('=')) {
      operation.setContainerTextContent(entry.current)
    } else operation.setContainerTextContent(operationContainer.textContent + entry.current)
  },
  doBasic(name) {
    const sign = operation.basic[name].sign
    if (entry.previous == null) {
      operation.end(Number(entry.current))
      if (
        operation.hasMathFunction() &&
        entry.isOverwritingEnabled &&
        !operationContainer.textContent.includes('=')
      ) {
        operation.setContainerTextContent(`${operationContainer.textContent} ${sign}`)
      }
      else operation.setContainerTextContent(`${entry.current} ${sign}`)
    }
    else {
      if (
        !entry.isOverwritingEnabled ||
        operation.hasContentAfterSign() ||
        memory.hasBeenRecovered
      ) {
        if (operation.checkDivisionByZero()) return

        const result = operation.basic[operation.last]
          .execute(entry.previous, Number(entry.current))
        
        calculatorHistory.operationSecondTerm = entry.current
        operation.end(result)

        calculatorHistory.addNewSave()

        operation.setContainerTextContent(`${Number(entry.current)} ${sign}`)
      } else if (operation.basic[operation.last].sign != sign) {
        operation.setContainerTextContent(operationContainer.textContent
          .replace(operation.basic[operation.last].sign, sign)
        )
      }
    }
    entry.savePrevious()
    operation.last = name
  },
  equal() {
    if (entry.previous == null) {
      if (operation.hasContentAfterSign()) {
        const sign = operation.getSign()
        const operationName = operation.getNameOfBasic(sign)

        operation.setContainerTextContent(
          `${entry.current} ${sign} ${calculatorHistory.operationSecondTerm} =`
        )

        const result = operation.basic[operationName].execute(
          Number(entry.current),
          Number(calculatorHistory.operationSecondTerm)
        )
        operation.end(result)
      } else {
        if (operation.hasMathFunction() && !operationContainer.textContent.includes('=')) {
          operation.setContainerTextContent(`${operationContainer.textContent} =`)
        } else operation.setContainerTextContent(`${Number(entry.current)} =`)
      }
    }
    else {
      if (operation.hasContentAfterSign()) {
        operation.setContainerTextContent(`${operationContainer.textContent} =`)
      } else {
        operation.setContainerTextContent(
          `${operationContainer.textContent} ${Number(entry.current)} =`
        )
      }
      
      if (operation.checkDivisionByZero()) return

      calculatorHistory.operationSecondTerm = entry.current
      const result = operation.basic[operation.last]
        .execute(entry.previous, Number(entry.current))
      operation.end(result)

      entry.previous = null
      operation.last = ''
    }
    calculatorHistory.addNewSave()
    entry.isOverwritingEnabled = true
  },
  checkDivisionByZero() {
    if (operation.last == 'division' && Number(entry.current) == 0) {
      operation.setContainerTextContent(`${entry.previous} ÷ 0`)

      if (entry.previous == '0') errorMode.display('Result is undefined')
      else errorMode.display('Cannot divide by zero')

      return true
    }
  },
  end(result) {
    if (!Number.isFinite(result)) return errorMode.display('Overflow')

    entry.current = operation.formatResult(result)
    entry.setNewAttributes()
    entry.showCurrent()

    memory.hasBeenRecovered = false
  },
  formatResult(result) {
    const output = result.toString()
    if (/\.9+$/.test(result) && output.length > 16) return Number(output.split('.')[0]) + 1
    const trailingZerosAfterDecimalPoint = output.match(/\.(0+)/) ?
      output.match(/\.(0+)/)[1] : ''
  
    if (output.includes('e-')) {
      const outputDigits = output.replace(/e.*/, '').match(/\d/g).join('')
      const fixedDigits = result.toFixed(16).match(/\d/g).join('')
  
      if (fixedDigits.includes(outputDigits)) {
        const fixedResult = result.toFixed(16)
        const trailingZeros = fixedResult.match(/\..*?(0+$)/) ?
          fixedResult.match(/\..*?(0+$)/)[1] : ''
  
        return fixedResult.replace(trailingZeros, '')
      }
    }
    return Number(
      result.toPrecision(16 - trailingZerosAfterDecimalPoint.length)
    ).toString().replace(/000000+1$/, '')
  },
  getContainerWidth() {
    const rootFontSize = getComputedStyle(document.documentElement).fontSize
    const rem = Number(rootFontSize.replace('px', ''))
    return document.querySelector('.equation').offsetWidth - 2 * rem
  },
  setContainerTextContent(content) {
    operationContainer.textContent = content
    operationContainer.style.left = '0px'
    rightArrow.style.display = 'none'

    if (operationContainer.offsetWidth > operation.getContainerWidth()) {
      leftArrow.style.display = 'block'
    } else leftArrow.style.display = 'none'
  },
  shiftContainerTextContent(sense) {
    const rightShift = Number(getComputedStyle(operationContainer).left.replace('px', ''))
    const maxRight = operationContainer.offsetWidth - operation.getContainerWidth()
    const MAX_SHIFT = 300

    if (sense == 'left') {
      rightArrow.style.display = 'block'
      var nextShift = rightShift + MAX_SHIFT
      if (nextShift >= maxRight) {
        leftArrow.style.display = 'none'
        nextShift = maxRight
      }
    } else {
      leftArrow.style.display = 'block'
      var nextShift = rightShift - MAX_SHIFT
      if (nextShift <= 0) {
        rightArrow.style.display = 'none'
        nextShift = 0
      }
    }
    operationContainer.style.left = nextShift + 'px'
  },
  clear() {
    operation.setContainerTextContent('')
    operation.last = ''
  }
}