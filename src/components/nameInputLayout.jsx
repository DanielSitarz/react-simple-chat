import React from 'react';
import styles from '../style/index.scss';

import Language from '../language.js';

class NameInputLayout extends React.Component {
  constructor(props){
    super(props);
    
    this.handleOnNameAccept = this.handleOnNameAccept.bind(this);

    this.defaultName = "Anonymous";
  }  
  handleOnFocus(e){
    e.target.select();
  }
  handleOnNameAccept(e){
    e.preventDefault();
    this.props.handleNameAccept(this.refs.userName.value);
  }
  render() {
    return (
        <form className={styles.nameInputLayout}>
          <div className={styles.content}>
            <label 
              htmlFor="yourName">
              {Language.getLang().texts.chatNameInput.yourName}: 
            </label>
            <input 
              maxLength="32" 
              autoFocus onFocus={this.handleOnFocus} 
              name="yourName" type="text" 
              defaultValue={this.defaultName}
              ref="userName" />
          </div>          
          <button onClick={this.handleOnNameAccept}>Enter</button>
        </form>
    )
  }
}

export default NameInputLayout;