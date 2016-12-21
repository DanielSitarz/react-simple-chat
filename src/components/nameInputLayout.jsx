import React from 'react';
import styles from '../style/index.scss';

import Language from '../language.js';

class NameInputLayout extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(){
    this.props.handleNameChange(this.refs.userName.value);
  }
  render() {
    return (
        <div className={styles.nameInputLayout}>
          <div className={styles.content}>
            <label htmlFor="yourName">{Language.getLang().texts.chatNameInput.yourName}: </label>
            <input name="yourName" type="text" value={this.props.userName} onChange={this.handleChange} ref="userName" />            
          </div>          
          <button>Enter</button>
        </div>
    )
  }
}

export default NameInputLayout;