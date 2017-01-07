import React, { PropTypes } from 'react';
import style from '../../style/Chat.scss';

const ChatAreTyping = ({areTyping}) => (
    <div className={style.isTypingBox}>
    {
        areTyping.map((e, i) => {
            return(<span key={i}>{e} is typing... </span>)
        })
    }
    </div>
)

ChatAreTyping.PropTypes = {
  areTyping: PropTypes.array,  
}

export default ChatAreTyping;