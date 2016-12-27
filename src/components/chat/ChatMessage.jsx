import React from 'react';

import styles from '../../style/index.scss';

const URLCheckPattern = new RegExp('http://|https://|www\.|ftp:');

const imgCheckPattern = new RegExp('.*(jpeg|jpg|png|gif|bmp)$');

const youtubeCheckPattern = new RegExp('youtube|youtu\.be');

class ChatMessage extends React.Component {  
  parseMessage(msg){
    if(URLCheckPattern.test(msg)){

      if(imgCheckPattern.test(msg)){
        return (
          <img src={msg}/>
        )  
      }

      if(youtubeCheckPattern.test(msg)){
        msg = msg.replace("watch?v=", "embed/"); 
        return (
          <iframe width="560" height="315" src={msg} frameBorder="0" allowFullScreen></iframe>
        )  
      }

      return (
        <a href={msg} target="_blank">{msg}</a>
      )
    }

    return msg;
  }
  render() {
    return (
      <div className={styles.chatMessage}>
        {this.parseMessage(this.props.msg)}
      </div>
    )
  }
}

export default ChatMessage;