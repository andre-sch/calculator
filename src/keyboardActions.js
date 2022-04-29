const keyboardActions = {
  functionTypes: {
    addCharacter: {
      keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
      execute: character => entry.addCharacter(character)
    },
    removeCharacter: {
      keys: ['Backspace'],
      execute: () => entry.removeCharacter()
    },
    clear: {
      keys: ['Delete'],
      execute: () => entry.clear()
    },
    mathFunctions: {
      keys: ['r', 'q', '@'],
      execute: mathFunction => operation.mathFunctions[mathFunction]()
    },
    percentage: {
      keys: ['%'],
      execute: () => operation.percentage()
    },
    doBasic: {
      keys: ['+', '-', '*', '/'],
      execute: name => operation.doBasic(name)
    },
    equal: {
      keys: ['Enter', '='],
      execute: () => operation.equal()
    },
    closeCard: {
      keys: ['Escape'],
      execute: entity => entity ? toggleDisplay[entity]() : null
    }
  },
  functionType: null,
  keyIndex: null,
  execute(event) {
    if (event.target.tagName == 'BUTTON' && event.key == 'Enter') return

    for (const type in this.functionTypes) {
      this.functionTypes[type].keys.forEach((key, index) => {
        if (key == event.key) {
          this.functionType = type
          this.keyIndex = index
        }
      })
    }
    if (this.functionType == null) return

    if (event.key != 'Escape') {
      const keyID = event.key == 'Enter' ? '=' : event.key
      const targetKeyButton = document.getElementById(`key ${keyID}`)
    
      targetKeyButton.classList.add('keyboard-hover')
      setTimeout(() => targetKeyButton.classList.remove('keyboard-hover'), 100)
    }
  
    const param = this.getParam(event)
  
    this.functionTypes[this.functionType].execute(param)
    this.functionType = null
  },
  getParam(event) {
    switch(this.functionType) {
      case 'addCharacter':
        return event.key
      case 'doBasic':
        return ['addition', 'subtraction', 'multiplication', 'division'][this.keyIndex]
      case 'mathFunctions':
        return ['multiplicativeInverse', 'square', 'squareRoot'][this.keyIndex]
      case 'closeCard':
        return bodyOverlay.classList[1]
      default:
        return null
    }
  }
}

document.addEventListener('keydown', event => keyboardActions.execute(event))

document.querySelectorAll('.keyboard button').forEach(button => {
  button.tabIndex = -1
  button.addEventListener('click', event => event.target.blur())
})