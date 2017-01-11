import React from 'react'

import chatStyle from '../style/Chat.scss'

const Message = ({content, power}) => (
  <li className={chatStyle.message} style={{fontSize: power + '%'}}>
    {parseMessage(content)}
  </li>
)

const URLCheckPattern = new RegExp('http://|https://|www.|ftp:')
const imgCheckPattern = new RegExp('.*(jpeg|jpg|png|gif|bmp)$')
const youtubeCheckPattern = new RegExp('youtube|youtu.be')
const parseMessage = (msg) => {
  if (URLCheckPattern.test(msg)) {
    if (imgCheckPattern.test(msg)) {
      return (
        <img src={msg} />
      )
    }

    if (youtubeCheckPattern.test(msg)) {
      msg = msg.replace('watch?v=', 'embed/')
      return (
        <iframe width='560' height='315' src={msg} frameBorder='0' allowFullScreen />
      )
    }

    return (
      <a href={msg} target='_blank'>{msg}</a>
    )
  }

  return msg
}

export default Message
