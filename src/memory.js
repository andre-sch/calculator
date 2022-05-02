const memory = {
  list: [],
  buttonsContent: ['MC', 'M+', 'M-'],
  tooltipsContent: [
    'Clear memory item',
    'Add to memory item',
    'Subtract from memory item'
  ],
  hasBeenRecovered: false,
  listContainer: document.querySelector('.bottom-card.memory ul'),
  populateCard() {
    cards.memory.classList.remove('empty')
    memory.listContainer.innerHTML = ''

    memory.list.forEach((save, listItemIndex) => {
      const listItem = document.createElement('li')
      listItem.tabIndex = 0

      listItem.onclick = event => memory.listItemRecall(event, listItemIndex)
      listItem.onkeydown = event => {
        if (event.key == 'Enter') memory.listItemRecall(event,listItemIndex)
      }

      listItem.innerHTML = `<output>${save}</output>`

      const actionsContainer = document.createElement('div')
      actionsContainer.className = 'memory-actions'

      const actionFunctions = [this.clear, this.plus, this.minus]
      actionFunctions.forEach((action, actionIndex) => {
        const actionButton = document.createElement('button')
        actionButton.textContent = memory.buttonsContent[actionIndex]
        actionButton.onclick = () => action(listItemIndex)

        var displayTooltipTimeout
        actionButton.onmouseenter = () => displayTooltipTimeout =
          setTimeout(() => actionButton.nextSibling.style.display = 'block', 1200)
        actionButton.onmouseleave = () => {
          clearTimeout(displayTooltipTimeout)
          actionButton.nextSibling.style.display = 'none'
        }
        
        const tooltip = document.createElement('div')
        tooltip.textContent = memory.tooltipsContent[actionIndex]
        tooltip.classList.add('tooltip', `action-${actionIndex}`)
        
        actionsContainer.appendChild(actionButton)
        actionsContainer.appendChild(tooltip)
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
      memory.deletingAnimation(index)
      setTimeout(() => memory.populateCard(), 800)
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
  recall(index = 0) {
    entry.current = memory.list[index]
    entry.setNewAttributes()
    entry.showCurrent()
    entry.isOverwritingEnabled = true
    memory.hasBeenRecovered = true

    if (entry.previous) {
      operation.clearContentAfterSign()
    } else if (operationContainer.textContent.includes('=')) {
      operationContainer.textContent = ''
    }
  },
  listItemRecall(event, index) {
    if (event.target.parentNode.className != 'memory-actions') {
      memory.recall(index)
      toggleDisplay.memory()
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
  },
  deletingAnimation(index) {
    const secondListItem = memory.listContainer.children[1]
    secondListItem.style.animation = 'removing-margin .6s forwards'
    
    const elementToDelete = memory.listContainer.children[index]
    elementToDelete.innerHTML = ''
    elementToDelete.style.animation = 'deleting-element .6s forwards'
  }
}