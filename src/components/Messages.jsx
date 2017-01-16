import React from 'react'
import Immutable from 'immutable'

import style from '../style/Chat.scss'

import MessagesGroup from './MessagesGroup'

class Messages extends React.Component {
  groupedMessages (msgs = []) {
    return msgs
      .reduce((groups, msg) => {
        if (groups.length === 0) {
          groups[0] = [msg]
          return groups
        }

        if (groups[groups.length - 1][0].sender !== msg.sender) {
          groups.push([])
        }

        groups[groups.length - 1].push(msg)

        return groups
      }, [])
      .map((msgs) => {
        return (<MessagesGroup key={msgs[0].key} msgs={msgs} />)
      })
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
          this.groupedMessages(this.props.messages.toJS())
        }
      </ul>
    )
  }
}

export default Messages
