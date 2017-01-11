import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'

import style from '../style/Chat.scss'

import MessagesGroup from '../components/MessagesGroup'

class MessagesContainer extends React.Component {
  constructor () {
    super()

    this.state = {
      groupedMessages: List()
    }
  }
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
  render () {
    return (
      <ul className={style.messagesContainer} ref='chatMessagesBox'>
        {
          this.groupMessages(this.props.messages.toJS()).map((msgs) => {
            return (<MessagesGroup key={msgs[0].key} msgs={msgs} />)
          })
        }
      </ul>
    )
  }
}

const mapStateToProps = function (store) {
  return {
    messages: store.messages
  }
}

export default connect(mapStateToProps)(MessagesContainer)
