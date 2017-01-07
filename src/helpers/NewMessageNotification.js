export default class NewMessageNotification {
  constructor () {
    this.newMessageTitleChanger = null
    this.originalTitle = document.originalTitle
    this.isFocused = true

    this.titleChangeTime = 1000

    this.setupEvents()
  }
  setupEvents () {
    window.addEventListener('focus', this.handleFocus.bind(this))
    window.addEventListener('blur', this.handleBlur.bind(this))
  }

  handleFocus () {
    this.isFocused = true

    if (!this.newMessageTitleChanger) return

    window.clearInterval(this.newMessageTitleChanger)
    document.title = this.originalTitle

    this.newMessageTitleChanger = null
  }
  handleBlur () {
    this.isFocused = false
  }

  notify () {
    if (this.isFocused) return

    if (this.newMessageTitleChanger) { clearInterval(this.newMessageTitleChanger) }

    this.setNotificationTitle()

    let i = 0
    this.newMessageTitleChanger = setInterval(() => {
      document.title = (i % 2 === 1) ? this.setNotificationTitle() : this.setOriginalTitle()
      i++
    }, this.titleChangeTime)
  }

  setOriginalTitle () {
    document.title = this.originalTitle
  }

  setNotificationTitle () {
    document.title = 'New message'
  }
}
