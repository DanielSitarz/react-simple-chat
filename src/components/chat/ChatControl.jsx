import React from 'react';
import styles from '../../style/index.scss';

class ChatControl extends React.Component {   
  render() {
    return (
      <form className={styles.chatControl} onSubmit={this.props.handleSendMessage} autoComplete="off">
          <input placeholder="Type..." ref="message" name="message"/>
          <button type="submit">Send</button>
        </form>
    )
  }
}

export default ChatControl;