const memory = {
  list: [],
  hasBeenRecovered: false,
  listContainer: document.querySelector('.bottom-card.memory ul'),
  populateCard() {
    cards.memory.classList.remove('empty')
    memory.listContainer.innerHTML = ''

    memory.list.forEach((save, listItemIndex) => {
      const listItem = document.createElement('li')

      listItem.innerHTML = `<output>${save}</output>`

      const actionsContainer = document.createElement('div')
      actionsContainer.className = 'memory-actions'

      const buttonsContent = ['MC', 'M+', 'M-']
      const actionFunctions = [this.clear, this.plus, this.minus]

      actionFunctions.forEach((action, actionIndex) => {
        const actionButton = document.createElement('button')
        actionButton.textContent = buttonsContent[actionIndex]
        actionButton.onclick = () => action(listItemIndex)

        actionsContainer.appendChild(actionButton)
      })
      
      listItem.appendChild(actionsContainer)
      memory.listContainer.appendChild(listItem)
    })
  },
  enableRowActions(whichOnes) {
    const memoryButtons = document.querySelectorAll('.memory-row button')
    const switchButtons = {
      default: [0, 0, 1, 1, 1, 0],
      all: [1, 1, 1, 1, 1, 1],
      none: [0, 0, 0, 0, 0, 0],
      justShowMemory: [0, 0, 0, 0, 0, 1]
    }
    
    switchButtons[whichOnes].forEach((value, index) => {
      memoryButtons[index].disabled = !Boolean(value)
    })
  },
  replaceSavedValue(index) {
    const targetListItem = memory.listContainer.children[index]
    targetListItem.firstChild.textContent = memory.list[index]
  },
  clear(index) {
    if (index != undefined && memory.list.length > 1) {
      memory.list.splice(index, 1)
      memory.populateCard()
    } else {
      cards.memory.classList.add('empty')
      memory.list = []

      if (toggleDisplay.isExpanded.memory) {
        memory.enableRowActions('none')
      } else {
        memory.enableRowActions('default')
      }
    }
  },
  recall() {
    entry.current = memory.list[0]
    entry.setNewAttributes()
    entry.showCurrent()
    entry.isOverwritingEnabled = true
    memory.hasBeenRecovered = true

    if (entry.previous) {
      operationContainer.textContent = operationContainer.textContent
        .replace(operation.matchContentAfterSign, '')
    } else if (operationContainer.textContent.includes('=')) {
      operationContainer.textContent = ''
    }
  },
  plus(index = 0) {
    const isFirstInput = memory.list.length == 0

    const result = Number(memory.list[index] || 0) + Number(entry.current)
    memory.list[index] = operation.formatResult(result)

    if (isFirstInput) {
      memory.populateCard()
      memory.enableRowActions('all')
    } else memory.replaceSavedValue(index)
    
    entry.isOverwritingEnabled = true
  },
  minus(index = 0) {
    const isFirstInput = memory.list.length == 0

    const result = Number(memory.list[index] || 0) - Number(entry.current)
    memory.list[index] = operation.formatResult(result)

    if (isFirstInput) {
      memory.populateCard()
      memory.enableRowActions('all')
    } else memory.replaceSavedValue(index)

    entry.isOverwritingEnabled = true
  },
  store() {
    memory.list.unshift(entry.current)
    memory.populateCard()
    memory.enableRowActions('all')
    entry.isOverwritingEnabled = true
  }
}