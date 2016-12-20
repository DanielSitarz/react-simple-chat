import React from 'react';
import styles from '../style/index.scss';

import Language from '../language.js';

class ChatControl extends React.Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();

    if(this.refs.message.value == ""){
      return;      
    }     

    this.props.handleSendMessage(this.refs.message.value);

    e.target.reset();
  }
  render() {
    return (
      <form className={styles.chatControl} onSubmit={this.handleSubmit} autoComplete="off">
          <input  placeholder={Language.getLang().texts.chatControl.inputPlaceholder + "..."} ref="message" />
          <button type="submit">{Language.getLang().texts.chatControl.send}</button>
        </form>
    )
  }
}

export default ChatControl;