import React, {PropTypes} from 'react';
import store from '../../store/store'

import messegesGroupStyle from '../../style/chat/messagesGroup.scss';

import ChatMessage from './ChatMessage.jsx';

const getGroupStyle = (sender) => {
  let isYourGroup = store.getState().chatState.userName == sender;
  return messegesGroupStyle.group + " " + (isYourGroup ? messegesGroupStyle.your : "");
}

const ChatMessageGroup = ({msgs}) => (
  <li className={getGroupStyle(msgs[0].sender)}>
    <div className={messegesGroupStyle.sender}>
      <strong>{msgs[0].sender}</strong>
    </div>
    <ul>
      {
        msgs.map((msg) => {
            return (
              <ChatMessage {...msg} />
            )
        })
      }
    </ul>
  </li>
)

export default ChatMessageGroup;