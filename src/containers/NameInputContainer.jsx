import React from 'react';
import styles from '../style/index.scss';

import {browserHistory} from 'react-router';

class NameInputContainer extends React.Component {
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
    browserHistory.push("/rooms");
    
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

export default NameInputContainer;