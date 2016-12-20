window.languageData = {
  en: {    
    name: "English",    
    texts: {
      appName: "Little Chat",
      chatBox: {
        header: {
          room: "Room"
        }        
      },
      chatNameInput: {
        yourName: "Nick"
      },
      languageSelectBox: {
        selectLanguage: "Select language"
      },
      chatControl: {
          send: "Send",
          inputPlaceholder: "Type something nice"
      }
    }
  },
  pl: {    
    name: "Polski",    
    texts: {
      appName: "Maleńki Czat",
      chatBox: {
        header: {
          room: "Pokój"
        }        
      },
      chatNameInput: {
        yourName: "Pseudonim"
      },
      languageSelectBox: {
        selectLanguage: "Wybierz język"
      },
      chatControl: {
          send: "Wyślij",
          inputPlaceholder: "Wpisz coś miłego"
      }
    }
  }
};

class Language{
    getLang(){        
        return window.languageData[window.currentLangKey];
    } 
}

export default new Language();