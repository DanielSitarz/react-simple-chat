import styles from './style/index.scss';
import React, {Component} from 'react';
import Header from './components/header.jsx';
import ChatBox from './components/chatBox.jsx';
import LanguageSelectBox from './components/languageSelectBox.jsx'
import NameInputBox from './components/nameInputBox.jsx';

import Language from './language.js';

const title = "Little Chat";
const roomName = "Positive Thinking";

const messagesData = [{
  key: "12345",
  sender: "Daniel",
  msg: "Hej :)"
}, {
  key: "123455",
  sender: "Merry",
  msg: "^^"
}, {
  key: "123451",
  sender: "Daniel",
  msg: "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation\""
}];

class App extends Component {
  constructor() {
    super();
    this.state = {
      userName: "Anon",
      currentLangKey: "en",            

      messages: messagesData,      
    }    

    window.currentLangKey = this.state.currentLangKey;
    
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleLangSelect = this.handleLangSelect.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleMessageSend(msg) {                
    const newMessage = {
      key: (new Date()).getTime(),
      sender: this.state.userName,
      msg: msg
    };

    messagesData.push(newMessage);

    this.setState({
      messages: messagesData
    });                
  }     
  handleLangSelect(langKey){        
    this.setState({
      currentLangKey: langKey
    });

    window.currentLangKey = langKey;
  }  
  handleNameChange(name){
    this.setState({
      userName: name
    });
  }  
  render() {
    return (
      <div className={styles.root}>
        <LanguageSelectBox languageData={languageData} handleLangSelect={this.handleLangSelect}/>        

        <Header title={Language.getLang().texts.appName} />        

        <div className={styles.chat}>
          <NameInputBox handleNameChange={this.handleNameChange} userName={this.state.userName}/>
          <ChatBox 
            roomName={roomName}                         
            handleSendMessage={this.handleMessageSend}             
            messages={this.state.messages} />
        </div>
        
        <ol className={styles.messagesData}>
        {
          this.state.messages.map((a) => {
            return(
              <li key={a.key}>{JSON.stringify(a)}</li>
            )
          })
        }
        </ol>
      </div>
    )
  }
}

export default App;