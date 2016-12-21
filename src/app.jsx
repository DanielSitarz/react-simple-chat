import styles from './style/index.scss';

import io from 'socket.io-client';
import React, {Component} from 'react';
import Header from './components/header.jsx';
import ChatBox from './components/chatBox.jsx';
import LanguageSelectBox from './components/languageSelectBox.jsx'
import NameInputLayout from './components/nameInputLayout';

import Language from './language.js';

var roomName = "Positive Thinking";

var messagesData = [];

class App extends Component {
  constructor() {
    super();    

    this.state = {
      userName: "Anon",
      currentLangKey: "en",            

      messages: messagesData,     

      currentStep: 0, 
    }    

    window.currentLangKey = this.state.currentLangKey;
    
    this.handlersSetup();
    
    this.socketSetup();
  }
  handlersSetup(){
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleLangSelect = this.handleLangSelect.bind(this);
    this.handleNameAccept = this.handleNameAccept.bind(this);    
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
    messagesData.push(newMsg);

    this.setState({
      messages: messagesData
    });
  }
  onChatMessage(data){
    const newMessage = this.createMessage(data.key, data.sender, data.msg);

    this.pushNewMessage(newMessage);
  }
  handleMessageSend(msg) {
    const newMessage = this.createMessage((new Date()).getTime(), this.state.userName, msg);

    this.pushNewMessage(newMessage);

    this.socket.emit('chat message', newMessage);
  }     
  handleLangSelect(langKey){        
    this.setState({
      currentLangKey: langKey
    });

    window.currentLangKey = langKey;
  }  
  handleNameAccept(name){
    this.setState({
      userName: name,
      currentStep: 1,
    });
  }  
  render() {

    let stepElement = null;

    switch(this.state.currentStep){
      case 0:
        stepElement = <NameInputLayout handleNameAccept={this.handleNameAccept}/>
      break;      
    }

    return (
      <div className={styles.root}>
        <LanguageSelectBox 
          languageData={languageData} 
          handleLangSelect={this.handleLangSelect}/>                 

        {stepElement}

        <div className={styles.chat + " " + (this.state.currentStep == 0 ? styles.blurred : "")}>          
          <ChatBox 
            roomName={roomName}                         
            handleSendMessage={this.handleMessageSend}             
            messages={this.state.messages} />
        </div>                
      </div>
    )
  }
}

export default App;