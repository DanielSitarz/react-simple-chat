import React from 'react'
import chatStyle from '../style/Chat.scss'

const img = (src) => <img src={src} role='presentation' />
const link = (src) => <a href={src} target='_blank'>{src}</a>
const video = (src) => <iframe width='560' height='315' src={src} frameBorder='0' allowFullScreen />

const URLCheckPattern = new RegExp('http://|https://|www.|ftp:')
const imgCheckPattern = new RegExp('.*(jpeg|jpg|png|gif|bmp)$')
const youtubeCheckPattern = new RegExp('youtube|youtu.be')

class Message extends React.Component {
  constructor () {
    super()
    this.state = {
      imageVisible: false
    }
  }
  handleImageToggle () {
    this.setState({
      imageVisible: !this.state.imageVisible
    })
  }
  parseMessage (msg) {
    if (URLCheckPattern.test(msg)) {
      if (imgCheckPattern.test(msg)) {
        return (
          <span>
            {link(msg)}
            <div className={chatStyle.showImageBar} onClick={() => { this.handleImageToggle() }}>
              {this.state.imageVisible ? 'Hide image' : 'Show image'}
            </div>
            <div style={{display: this.state.imageVisible ? 'block' : 'none'}}>{img(msg)}</div>
          </span>
        )
      }

      if (youtubeCheckPattern.test(msg)) {
        let videoSrc = msg.replace('watch?v=', 'embed/')
        return (
          video(videoSrc)
        )
      }

      return (
        link(msg)
      )
    }

    return msg
  }
  render () {
    const {power, content} = this.props
    return (
      <li className={chatStyle.message} style={{fontSize: power + '%'}}>
        {this.parseMessage(content, this.state.imageVisible)}
      </li>
    )
  }
}

export default Message
