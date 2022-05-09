const calculatorHistory = {
  list: [],
  operationSecondTerm: null,
  listContainer: document.querySelector('.bottom-card.history ul'),
  addNewSave() {
    var formattedOperation = operationContainer.textContent
    const sign = operation.getSign()

    if (operation.hasContentAfterSign()) {
      formattedOperation = operationContainer.textContent
        .replace(` ${sign} `, `   ${sign}   `)
      if (!operationContainer.textContent.includes('=')) {
        formattedOperation += ' ='
      }
    } else if (entry.previous != null) {
      formattedOperation = operationContainer.textContent
        .replace(` ${sign}`, `   ${sign}`)
        + `   ${this.operationSecondTerm} =`
    }

    this.list.unshift({
      operation: formattedOperation,
      operationSecondTerm: this.operationSecondTerm,
      current: entry.current
    })

    this.populateCard()
  },
  populateCard() {
    cards.history.classList.remove('empty')
    calculatorHistory.listContainer.innerHTML = ''

    this.list.forEach((save, index) => {
      const listItem = document.createElement('li')
      const displayButton = document.createElement('button')

      displayButton.onclick = () => calculatorHistory.displaySave(index)
      listItem.appendChild(displayButton)
      
      const pre = document.createElement('pre')
      const output = document.createElement('output')
      
      pre.textContent = save.operation
      output.textContent = save.current

      const elementsToDisableDrag = [pre, output]
      elementsToDisableDrag.forEach(element => takeOutDrag(element))

      listItem.appendChild(pre)
      listItem.appendChild(document.createElement('br'))
      listItem.appendChild(output)
      calculatorHistory.listContainer.appendChild(listItem)
    })
  },
  displaySave(index) {
    const {
      operation: savedOperation,
      operationSecondTerm,
      current: savedCurrent
    } = this.list[index]
    
    operation.setContainerTextContent(savedOperation)
    operation.last = ''
    this.operationSecondTerm = operationSecondTerm

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