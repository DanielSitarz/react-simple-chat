import React from 'react';

import { connect } from 'react-redux';
import store from '../store/store';
import { List, Map } from 'immutable'; 

import chatStyle from '../style/Chat.scss';

/*My Components*/
import ChatHeader from '../components/chat/ChatHeader.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatAreTyping from '../components/chat/ChatAreTyping.jsx';
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

    this.chatMessages = null;

    this.isTypingTimeout = null;
    this.youAreTyping = false;

    this.newMessageNotification = new NewMessageNotification();
    
    window.addEventListener('resize', this.scrollToBottom.bind(this));    

    this.bindEvents();
    this.setupSocket();    
    this.enterRoom();    
  }
  componentDidUpdate(){
    this.saveMessagesToLocalStorage();
  }
  saveMessagesToLocalStorage(){        
    localStorage.setItem(this.props.params.roomName + "_messages", JSON.stringify(this.props.messages));
  }
  bindEvents(){
    this.handleSendMessage = this.handleSendMessage.bind(this);    
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMessageTyping = this.handleMessageTyping.bind(this);    
    this.handleMessageFocus = this.handleMessageFocus.bind(this);            
    this.scrollToBottom = this.scrollToBottom.bind(this);        
  }
  setupSocket(){
    this.socket = io('https://socket-chat-server-to-react.herokuapp.com/');  

    this.socket.on('chat message', this.onReceiveChatMessage.bind(this));    
    this.socket.on('is typing', this.onTypingStart.bind(this));    
    this.socket.on('stopped typing', this.onTypingStop.bind(this));    
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
    this.props.addMsg(this.createMessageFromServer(this.props.userName + " connected."));
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

    this.props.addMsg(msg);
  }  
  handleSendMessage(inputElement) {
    let msg = inputElement.value;    
    if(msg == ""){
      return;      
    }                 

    inputElement.value = '';
    inputElement.focus();

    const newMessage = this.createMessage(undefined, this.props.userName, msg);            

    this.props.addMsg(newMessage);

    this.socket.emit('chat message', newMessage);
    this.youAreTyping = false;
    this.socket.emit('stopped typing', this.props.userName);        
  }  
  scrollToBottom(){          
    this.refs.chatMessages.refs.chatMessagesBox.scrollTop = this.refs.chatMessages.refs.chatMessagesBox.scrollHeight;
  }          
  handleMessageFocus(){
    this.scrollToBottom();
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
  onTypingStart(who){
    store.dispatch({
      type: "TYPING_START",
      who: who
    });                
  }
  onTypingStop(who){    
    store.dispatch({
      type: "TYPING_STOP",
      who: who
    });           
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
    
    this.props.addMsg(this.createMessageFromServer( oldName + " changes name to " + newName + "."));

    this.socket.emit('name change', newName);
  }   
  render() {    
    return (      
        <div className={chatStyle.Chat}>          
          <ChatHeader 
            userName={this.props.userName}
            roomName={this.props.params.roomName} 
            handleNameChangeModalOpen={this.handleNameChangeModalOpen}/>

          <ChatMessages 
            scrollToBottom={this.scrollToBottom}
            messages={this.props.messages.toJS()} 
            ref="chatMessages" />

          <ChatAreTyping areTyping={this.props.areTyping}/>

          <ChatControl             
            handleSendMessage={this.handleSendMessage} 
            handleMessageTyping={this.handleMessageTyping} />
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

const mapDispatchToProps = function(dispatch) {  
  return {
    addMsg: (msg) => {dispatch({ type: "ADD_MSG", msg: msg });},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);