export default class NewMessageNotification {
  constructor (config = {}) {
    this.config = Object.assign({
      titleNotificationText: 'New message',
      titleChangeInterval: 1000
    }, config)

    this.newMessageTitleChanger = null
    this.originalTitle = document.title
    this.isFocused = true

    this.bindHandlers()
    this.addEvents()
  }
  bindHandlers () {
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }
  addEvents () {
    window.addEventListener('focus', this.handleFocus, false)
    window.addEventListener('blur', this.handleBlur, false)
  }

  notify () {
    if (this.isFocused) return

    this.setNotificationTitle()

    this.runTitleChanger()
  }

  /**
   * Title Changer
   */

  runTitleChanger () {
    if (this.newMessageTitleChanger) { clearInterval(this.newMessageTitleChanger) }

    let i = 0
    this.newMessageTitleChanger = setInterval(() => {
      this.switchTitle(i)
      i++
    }, this.config.titleChangeInterval)
  }
  stopTitleChanger () {
    window.clearInterval(this.newMessageTitleChanger)
    this.newMessageTitleChanger = null
  }
  switchTitle (i) {
    if (i % 2 === 1) {
      this.setNotificationTitle()
    } else {
      this.resetTitleToOriginalState()
    }
  }

  /**
   * Title Helpers
   */

  setDocumentTitle (newTitle) {
    document.title = newTitle
  }
  setNotificationTitle () {
    this.setDocumentTitle(this.config.titleNotificationText)
  }
  resetTitleToOriginalState () {
    this.setDocumentTitle(this.originalTitle)
  }

  /**
  * Events Handlers
  */

  handleFocus () {
    this.isFocused = true

    if (!this.newMessageTitleChanger) return

    this.stopTitleChanger()
    this.resetTitleToOriginalState()
  }
  handleBlur () {
    this.isFocused = false
  }
}
