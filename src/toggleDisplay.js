const toggleDisplay = {
  isExpanded: {
    menu: false,
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