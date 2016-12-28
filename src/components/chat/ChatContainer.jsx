import React from 'react';

/*My Components*/
import Chat from './Chat.jsx';

/*Third Party*/
import io from 'socket.io-client';
import expect from 'expect';


var messagesData = [
  {
    key: 0,
    sender: "D",
    msg: "Hello Cutie"
  },
  {
    key: 1,
    sender: "D",
    msg: "https://www.youtube.com/watch?v=rT_I_GV_oEM"
  }
];

class ChatContainer extends React.Component {
  constructor(props){
    super(props);        

    this.state = {
        messages: messagesData
    };

    this.handleSendMessage = this.handleSendMessage.bind(this);

    this.socketSetup();


    expect(
      this.createMessage(0, "Dan", "Hey")
    ).toEqual(
      {
        key: 0,
        sender: "Dan",
        msg: "Hey"
      }
    )
  }   
  socketSetup(){
    this.socket = io('https://socket-chat-server-to-react.herokuapp.com/');    

    this.socket.on('chat message', this.onChatMessage.bind(this));         
  } 
  createMessage(key, sender, msg){
    return {
      key: key,
      sender: sender,
      msg: msg
    };
  }
  pushNewMessage(newMsg){
    let newState = Object.assign({}, this.state);      
    newState.messages.push(newMsg);

    this.setState(newState);
  }
  onChatMessage(data){
    const newMessage = this.createMessage(data.key, data.sender, data.msg);    

    this.pushNewMessage(newMessage);
  }
  handleSendMessage(e) {
    e.preventDefault();
    
    let msg = e.target.message.value;

    if(msg == ""){
      return;      
    }             

    const newMessage = this.createMessage((new Date()).getTime(), this.props.userName, msg);    

    this.pushNewMessage(newMessage);

    this.socket.emit('chat message', newMessage);

    e.target.reset();
  }
  render() {
    return (
        <Chat
            roomName={this.props.params.room}
            handleSendMessage={this.handleSendMessage}
            messages={this.state.messages} />
    )
  }
}

export default ChatContainer;