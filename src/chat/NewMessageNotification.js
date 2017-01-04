export default class NewMessageNotification{
    constructor(){
        this.newMessageTitleChanger = 0;
        this.title = document.title;
        this.isFocused = true;

        this.setupEvents();
    }
    setupEvents(){
        window.addEventListener("focus", this.handleFocus.bind(this));
        window.addEventListener("blur", this.handleBlur.bind(this));
    }

    handleFocus(){
        this.isFocused = true;

        if(!this.newMessageTitleChanger) return;

        window.clearInterval(this.newMessageTitleChanger);
        document.title = this.title;  

        this.newMessageTitleChanger = null;
    }

    handleBlur(){
        this.isFocused = false;        
    }

    notifyAboutNewMessage(){
        if(this.isFocused) return;
        
        if(this.newMessageTitleChanger)
        clearInterval(this.newMessageTitleChanger);

        let i = 0;
        document.title = "New Message";
        this.newMessageTitleChanger = setInterval(() => {
            if(i % 2 == 1){
                document.title = "New Message";
            }else{
                document.title = this.title;
            }
            i++;
        }, 1000);
  }
}