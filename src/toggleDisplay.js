const toggleDisplay = {
  isExpanded: {
    menu: false,
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
  card(entity) {
    const card = cards[entity]
    card.style.animationPlayState = 'running'

    setTimeout(() => {
      card.style.animationPlayState = 'paused'
      if (this.isExpanded[entity]) {
        card.classList.remove('expanded')

        bodyOverlay.style.display = 'none'
        bodyOverlay.removeEventListener('click', this[entity])
      } else {
        card.classList.add('expanded')
        
        bodyOverlay.style.display = 'block'
        bodyOverlay.addEventListener('click', this[entity])
      }
      this.isExpanded[entity] = !this.isExpanded[entity]
    }, 250)
  }
}