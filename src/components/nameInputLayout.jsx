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
        <div className={styles.nameInputLayout}>
          <form action="" className={styles.box}> 
            <label htmlFor="yourName">Enter your name:</label>
            <input 
                maxLength="32" 
                minLength="1"
                autoFocus onFocus={this.handleOnFocus} 
                name="yourName" type="text" 
                defaultValue={this.defaultName}
                ref="userName" />
            <button onClick={this.handleOnNameAccept}>OK, select room</button>
          </form>       
        </div>
    )
  }
}

export default NameInputLayout;