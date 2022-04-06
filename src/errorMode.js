const eventCallback = event => errorMode.hide(event)

const errorMode = {
  display() {
    const buttonsToDisable = document.getElementsByClassName('enabled')

    while (buttonsToDisable.length > 0) {
      const element = buttonsToDisable[0]
      element.classList.replace('enabled', 'disabled')
      element.setAttribute('disabled', true)
    }
    
    const enabledButtons = document.querySelectorAll('.keyboard button:enabled')
    for (const button of enabledButtons) {
      button.addEventListener('click', eventCallback)
    }
    output.style.fontSize = '1.75rem'
  },
  hide(event) {
    const enabledButtons = document.querySelectorAll('.keyboard button:enabled')
    for (const button of enabledButtons) {
      button.removeEventListener('click', eventCallback)
    }
    
    const buttonsToEnable = document.getElementsByClassName('disabled')
    
    while (buttonsToEnable.length > 0) {
      const element = buttonsToEnable[0]
      element.classList.replace('disabled', 'enabled')
      element.removeAttribute('disabled')
    }
    
    output.style.fontSize = '2.25rem'
    clearEverything()
    if (event.target.className.includes('number')) {
      event.target.onclick()
    }
  }
}