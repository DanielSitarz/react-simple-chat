import React from 'react';

import { connect } from 'react-redux';
import store from '../store/store';

import chatStyle from '../style/Chat.scss';

/*My Components*/
import ChatHeader from '../components/chat/ChatHeader.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatControl from '../components/chat/ChatControl.jsx';

import ChatNameSelectModal from '../components/chat/ChatNameSelectModal';

/*Third Party*/
import io from 'socket.io-client';

class ChatContainer extends React.Component {
  constructor(props){
    super(props);            

    this.state = {
      nameSelectModalOpen: false
    };

    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleNameChangeModalOpen = this.handleNameChangeModalOpen.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);

    this.socketSetup();            
  }   
  socketSetup(){
    this.socket = io('https://socket-chat-server-to-react.herokuapp.com/');    

    this.socket.emit("enter room", {
      userName: this.props.userName,
      roomName: this.props.params.roomName
    });

    this.socket.on('chat message', this.onReceiveChatMessage.bind(this));    
  } 
  createMessage(key = (new Date()).getTime(), sender, msg){    
    return {
      key: key,
      sender: sender,
      content: msg,
      power: 1.0,
      roomName: this.props.params.roomName
    };
  }  
  onReceiveChatMessage(data){            
    store.dispatch({
      type: "ADD_MSG",
      msg: data
    });            
  }
  handleSendMessage(e) {
    e.preventDefault();
    
    let msg = e.target.message.value;

    if(msg == ""){
      return;      
    }             

    const newMessage = this.createMessage(undefined, this.props.userName, msg);        

    store.dispatch({
      type: "ADD_MSG",
      msg: newMessage
    });                

    this.socket.emit('chat message', newMessage);

    e.target.reset();
  }
  handleNameChangeModalOpen(){
    let newState = {
      nameSelectModalOpen: true
    };
    this.setState(newState);
  }
  handleNameChange(newName){    
    store.dispatch({
      type: "USER_SET_NAME",
      name: newName
    });    
    let newState = {
      nameSelectModalOpen: false
    };
    this.setState(newState);

    this.socket.emit('name change', newName);
  }   
  render() {
    return (      
        <div className={chatStyle.Chat}>
          <ChatNameSelectModal 
            show={this.state.nameSelectModalOpen} 
            handleNameChange={this.handleNameChange}/>        
          <ChatHeader 
            userName={this.props.userName}
            roomName={this.props.params.roomName} 
            handleNameChangeModalOpen={this.handleNameChangeModalOpen}/>
          <ChatMessages messages={this.props.messages} />
          <ChatControl handleSendMessage={this.handleSendMessage} />
        </div>      
    )
  }
}

const mapStateToProps = function(store) {  
  return {
    userName: store.chatState.userName,
    messages: store.messages
  }
}

export default connect(mapStateToProps)(ChatContainer);