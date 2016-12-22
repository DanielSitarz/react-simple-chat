import React from 'react';


const URLCheckPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

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
      <p>{this.parseMessage(this.props.msg)}</p>
    )
  }
}

export default ChatMessage;