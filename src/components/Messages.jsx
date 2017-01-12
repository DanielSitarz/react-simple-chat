import React from 'react'
import Immutable from 'immutable'

import style from '../style/Chat.scss'

import MessagesGroup from './MessagesGroup'

class Messages extends React.Component {
  groupMessages (msgs = []) {
    let groupedMessages = []
    let messagesToGroup = []

    let i = 0
    while (i < msgs.length) {
      messagesToGroup.push(msgs[i])
      let nextGroup = msgs[i + 1]
      if (nextGroup === undefined || this.isNextSenderDifferent(msgs, i)) {
        groupedMessages.push(messagesToGroup)
        messagesToGroup = []
      }
      i++
    }
    return groupedMessages
  }
  isNextSenderDifferent (msgs, currentIndex) {
    return msgs[currentIndex].sender !== msgs[currentIndex + 1].sender
  }

  shouldComponentUpdate (prevProps) {
    return !Immutable.is(this.props.messages, prevProps.messages)
  }
  componentDidUpdate () {
    this.container.scrollTop = this.container.scrollHeight
  }
  render () {
    return (
      <ul className={style.messagesContainer} ref={(ref) => { this.container = ref }}>
        {
          this.groupMessages(this.props.messages.toJS()).map((msgs) => {
            return (<MessagesGroup key={msgs[0].key} msgs={msgs} />)
          })
        }
      </ul>
    )
  }
}

export default Messages
