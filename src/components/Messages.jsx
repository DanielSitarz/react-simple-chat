import React from 'react'
import chatStyle from '../../style/Chat.scss'

import MessagesGroup from './MessagesGroup'
import MessagesGroupFromServer from './MessagesGroupFromServer'

class Messages extends React.Component {
  componentDidUpdate () {
    this.props.scrollToBottom()
  }
  render () {
    return (
      <ul className={chatStyle.messages} ref='chatMessagesBox'>
        {
          groupMessages(this.props.messages).map((group) => {
            if (group.msgs[0].power === -1 && group.msgs[0].isFromServer) {
              return (<MessagesGroupFromServer {...group} />)
            } else { return (<MessagesGroup {...group} />) }
          })
        }
      </ul>
    )
  }
}

const groupMessages = (msgs = []) => {
  let groupedMessages = []
  let messagesToGroup = []

  let i = 0
  while (i < msgs.length) {
    messagesToGroup.push(msgs[i])
    if (msgs[i + 1] === undefined || msgs[i].sender !== msgs[i + 1].sender) {
      groupedMessages.push(
        {
          msgs: messagesToGroup,
          key: messagesToGroup[0].key
        }
      )
      messagesToGroup = []
    }
    i++
  }

  return groupedMessages
}

export default Messages
