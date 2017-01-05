import React from 'react';

import { connect } from 'react-redux';
import store from '../store/store';

import chatStyle from '../style/Chat.scss';

/*My Components*/
import ChatHeader from '../components/chat/ChatHeader.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatControl from '../components/chat/ChatControl.jsx';

import NewMessageNotification from '../chat/NewMessageNotification';

/*Third Party*/
import io from 'socket.io-client';

class ChatContainer extends React.Component {
  constructor(props){
    super(props);            

    this.state = {
      nameSelectModalOpen: false,      
    };         

    this.isTypingTimeout = null;
    this.youAreTyping = false;

    this.newMessageNotification = new NewMessageNotification();

    this.bindEvents();
    this.setupSocket();    
    this.enterRoom();    
  }   
  bindEvents(){
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleNameChangeModalOpen = this.handleNameChangeModalOpen.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMessageTyping = this.handleMessageTyping.bind(this);    
  }
  setupSocket(){
    this.socket = io('https://socket-chat-server-to-react.herokuapp.com/');  

    this.socket.on('chat message', this.onReceiveChatMessage.bind(this));    
    this.socket.on('is typing', this.onSomeoneIsTyping.bind(this));    
    this.socket.on('stopped typing', this.onSomeoneStoppedTyping.bind(this));    
  }   
  enterRoom(){
    this.socket.emit("enter room", {
      userName: this.props.userName,
      roomName: this.props.params.roomName
    });
    store.dispatch({
      type: "SET_MSGS",
      msgs: JSON.parse(localStorage.getItem(this.props.params.roomName + "_messages"))
    });  
     store.dispatch({
      type: "ADD_MSG",
      msg: this.createMessageFromServer(this.props.userName + " connected.")
    });  
  }

  createMessage(key = (new Date()).getTime(), sender, content){    
    return {
      key: key,
      sender: sender,
      content: content,
      power: 1.0,
      roomName: this.props.params.roomName
    };
  } 
  createMessageFromServer(content){    
    let msg = this.createMessage(undefined, "Chat", content)
    msg.power = 0;
    msg.isFromServer = true;
    return msg;
  }   
  onReceiveChatMessage(data){                        
    let msg;
    if(!data.isFromServer){            
      msg = data;
      this.newMessageNotification.notifyAboutNewMessage();      
    }else{
      msg = this.createMessageFromServer(data.content);
    }

    store.dispatch({
      type: "ADD_MSG",
      msg: msg
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
    this.youAreTyping = false;
    this.socket.emit('stopped typing', this.props.userName);

    e.target.reset();
  }
  /**
   * Notify others in rooms that you are typing
   */
  handleMessageTyping(e){
    if(this.youAreTyping) {
      window.clearTimeout(this.isTypingTimeout);
      this.startTypingTimeout();
      return;
    }

    this.youAreTyping = true;
    
    this.startTypingTimeout();

    this.socket.emit('is typing', this.props.userName);                  
  }
  startTypingTimeout(){
    window.clearTimeout(this.isTypingTimeout);
    this.isTypingTimeout = window.setTimeout(() => {
      this.youAreTyping = false;
      this.socket.emit('stopped typing', this.props.userName);
    }, 3000);     
  }
  /**
   * Handle typing notigications from others
   */
  onSomeoneIsTyping(who){
    store.dispatch({
      type: "IS_TYPING",
      who: who
    });                
  }
  onSomeoneStoppedTyping(who){    
    store.dispatch({
      type: "STOPPED_TYPING",
      who: who
    });       
    this.forceUpdate();
  }

  handleNameChangeModalOpen(){
    let newState = {
      nameSelectModalOpen: true
    };
    this.setState(newState);
  }
  handleNameChange(newName){        
    let newState = {
      nameSelectModalOpen: false
    };
    this.setState(newState);    

    let oldName = this.props.userName;

    store.dispatch({
      type: "USER_SET_NAME",
      name: newName
    });    
    store.dispatch({
      type: "ADD_MSG",
      msg: this.createMessageFromServer( oldName + " changes name to " + newName + ".")
    });    

    this.socket.emit('name change', newName);
  }   
  render() {
    return (      
        <div className={chatStyle.Chat}>          
          <ChatHeader 
            userName={this.props.userName}
            roomName={this.props.params.roomName} 
            handleNameChangeModalOpen={this.handleNameChangeModalOpen}/>
          <ChatMessages messages={this.props.messages} />
          <div className={chatStyle.isTypingBox}>
            {
              this.props.areTyping.map((e, i) => {
                return(<span key={i}>{e} is typing...</span>)
              })
            }
          </div>
          <ChatControl handleSendMessage={this.handleSendMessage} handleMessageTyping={this.handleMessageTyping} />
        </div>      
    )
  }
}

const mapStateToProps = function(store) {  
  return {
    userName: store.chatState.userName,    
    messages: store.messages,    
    areTyping: store.areTyping
  }
}

export default connect(mapStateToProps)(ChatContainer);