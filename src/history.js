const calculatorHistory = {
  list: [],
  operationSecondTerm: null,
  listContainer: document.querySelector('.bottom-card.history ul'),
  addNewSave() {
    var formattedOperation = operationContainer.textContent

    if (entry.previous == null) {
      if (operationContainer.textContent.includes('=')) {
        const hasBasicOperation = /[-+×÷]/.test(operationContainer.textContent)
        if (hasBasicOperation) {
          const sign = operation.basic[operation.last].sign
          formattedOperation = operationContainer.textContent
            .replace(` ${sign} `, `   ${sign}   `)
        }
      }
    } else {
      const hasContentAfterSign = operation.matchContentAfterSign
        .test(operationContainer.textContent)

      const sign = operation.basic[operation.last].sign
      if (hasContentAfterSign) {
        formattedOperation = operationContainer.textContent
          .replace(` ${sign} `, `   ${sign}   `)
          + ' ='
      } else {
        formattedOperation = operationContainer.textContent
          .replace(` ${sign}`, `   ${sign}`)
          + `   ${this.operationSecondTerm} =`
      }
    }

    this.list.unshift({
      operation: formattedOperation,
      current: entry.current
    })

    this.populateCard()
  },
  populateCard() {
    cards.history.classList.remove('empty')
    calculatorHistory.listContainer.innerHTML = ''

    this.list.forEach((save, index) => {
      const listItem = document.createElement('li')

      listItem.innerHTML =
        `<pre>${save.operation}</pre>` +
        `<output>${save.current}</output>`

      listItem.onclick = () => calculatorHistory.displaySave(index)
      
      calculatorHistory.listContainer.appendChild(listItem)
    })
  },
  displaySave(index) {
    const {operation: savedOperation, current: savedCurrent} = this.list[index]
    
    operationContainer.textContent = savedOperation
    operation.last = ''

    entry.previous = null
    entry.current = savedCurrent
    entry.setNewAttributes()
    entry.showCurrent()
    entry.isOverwritingEnabled = true

    toggleDisplay.history()
  },
  clear() {
    calculatorHistory.list = []
    cards.history.classList.add('empty')
  }
}