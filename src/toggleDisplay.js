const toggleDisplay = {
  isExpanded: {
    menu: false,
    history: false,
    memory: false
  },
  calculatorOverlay(entity) {
    if (this.isExpanded[entity]) {
      calculatorOverlay.style.display = 'none'
      calculatorOverlay.removeEventListener('click', this[entity])
    } else {
      calculatorOverlay.style.display = 'block'
      calculatorOverlay.addEventListener('click', this[entity])
    }
  },
  menu: () => {
    toggleDisplay.card('menu')
  },
  history: () => {
    toggleDisplay.calculatorOverlay('history')
    toggleDisplay.card('history')
  },
  memory: (event, openingCard = false) => {
    toggleDisplay.calculatorOverlay('memory')
    toggleDisplay.card('memory')

    if (openingCard) {
      memory.enableRowActions('justShowMemory')
    }
    else if (memory.list.length == 0) {
      memory.enableRowActions('default')
    } else {
      memory.enableRowActions('all')
    }
  },
  card(entity) {
    const card = cards[entity]
    card.style.animationPlayState = 'running'

    if (!this.isExpanded[entity]) {
      card.style.display = 'block'
      tabNavigationButtons.forEach(button => button.tabIndex = -1)
    }

    setTimeout(() => {
      card.style.animationPlayState = 'paused'
      if (this.isExpanded[entity]) {
        card.classList.remove('expanded')
        card.style.display = 'none'
        tabNavigationButtons.forEach(button => button.tabIndex = 0)

        bodyOverlay.style.display = 'none'
        bodyOverlay.classList.remove(entity)
        bodyOverlay.removeEventListener('click', this[entity])
      } else {
        card.classList.add('expanded')
        
        bodyOverlay.style.display = 'block'
        bodyOverlay.classList.add(entity)
        bodyOverlay.addEventListener('click', this[entity])
      }
      this.isExpanded[entity] = !this.isExpanded[entity]
    }, 250)
  }
}