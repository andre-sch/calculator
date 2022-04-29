const clickEventCallback = event => errorMode.hide(event)
const keyPressEventCallback = event => keyboardActions.undoErrorMode(event)

const errorMode = {
  display(message) {
    output.value = message

    const buttonsToDisable = document.getElementsByClassName('enabled')
    while (buttonsToDisable.length > 0) {
      const element = buttonsToDisable[0]
      element.classList.replace('enabled', 'disabled')
      element.setAttribute('disabled', true)
    }
    
    document.addEventListener('keydown', keyPressEventCallback)
    const enabledButtons = document.querySelectorAll('.keyboard button:enabled')
    for (const button of enabledButtons) {
      button.addEventListener('click', clickEventCallback)
    }

    memory.enableRowActions('none')

    output.style.fontSize = '1.75rem'
  },
  hide(event) {
    document.removeEventListener('keydown', keyPressEventCallback)
    const enabledButtons = document.querySelectorAll('.keyboard button:enabled')
    for (const button of enabledButtons) {
      button.removeEventListener('click', clickEventCallback)
    }
    
    const buttonsToEnable = document.getElementsByClassName('disabled')
    
    while (buttonsToEnable.length > 0) {
      const element = buttonsToEnable[0]
      element.classList.replace('disabled', 'enabled')
      element.removeAttribute('disabled')
    }
    
    if (memory.list.length == 0) {
      memory.enableRowActions('default')
    } else {
      memory.enableRowActions('all')
    }

    output.style.fontSize = '2.25rem'
    clearEverything()

    var targetButton
    if (event.type == 'click') {
      targetButton = event.target
    } else if (event.type == 'keydown') {
      const keyID = event.key == 'Enter' ? '=' : event.key
      targetButton = document.getElementById(`key ${keyID}`)
    }
    if (targetButton.className.includes('number')) {
      targetButton.onclick()
    }
  }
}