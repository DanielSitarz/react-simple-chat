import React from 'react';
import styles from '../style/index.scss';

import Language from '../language.js';

class LanguageSelectBox extends React.Component {
  constructor(){
    super();
    this.state = {
      
    }
  }
  getLanguagesList(){
    let _this = this;

    let languages = [];
    for(let langKey in _this.props.languageData){
      languages.push(        
        <li key={langKey}>
          <button onClick={() => {_this.props.handleLangSelect(langKey);}}>{_this.props.languageData[langKey].name}</button>
        </li>
      );
    }    
    return languages;
  }
  render() {
    return (
        <div className={styles.languageSelectBox}>            
            <ol>{this.getLanguagesList()}</ol>
        </div>
    )
  }
}

export default LanguageSelectBox;