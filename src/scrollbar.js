var browserDefaultScrollbarWidth

(function measureScrollbarWidth() {
  var scrollDiv = document.createElement("div")
  scrollDiv.className = "scrollbar-measure"

  document.body.appendChild(scrollDiv)
  browserDefaultScrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      
  document.body.removeChild(scrollDiv);
})()
    
var reduceWidthTimeout
var scrollbarContainers = document.querySelectorAll('.saves-container')
var scrollbarCurrentWidth = 6
const containerWidth = 356

document.addEventListener('mousemove', event => {
  if (event.target.className.includes('saves-container')) {
    if (
      (event.offsetX > containerWidth - scrollbarCurrentWidth) &&
      (event.offsetX < containerWidth)
    ) {
      clearTimeout(reduceWidthTimeout)
      reduceWidthTimeout = null

      scrollbarContainers.forEach(
        scrollbarContainer => scrollbarContainer.classList.remove('thin-scroll')
      )
      scrollbarCurrentWidth = browserDefaultScrollbarWidth
      return
    }
  }
  if (reduceWidthTimeout) return

  const isScrollbarThinner = scrollbarCurrentWidth == 6
  if (!isScrollbarThinner) {
    reduceWidthTimeout = setTimeout(() => {
      scrollbarContainers.forEach(
        scrollbarContainer => scrollbarContainer.classList.add('thin-scroll')
      )
      scrollbarCurrentWidth = 6
    }, 2000)
  }
})