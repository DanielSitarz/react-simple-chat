import { createStore, combineReducers } from 'redux';
import randomNameGenerator from '../helpers/randomNameGenerator'

const chatUserInitialState = {
    userName: randomNameGenerator(),
    usersInRoom: [],
    roomName: "DogsLovers",    
}

const chatMessagesInitialState = {};

const messagesReducer = (state = chatMessagesInitialState, action) => {            
    switch(action.type){
        case "SET_MSGS":                                   
            return action.msgs || {};
        break;
        case "ADD_MSG":                       
            let newState = [...state, action.msg];
            localStorage.setItem(action.msg.roomName + "_messages", JSON.stringify(newState));
            return newState;
        break;
        case "USER_SEND_MSG":
            return state;
        break;
        case "USER_RECEIVED_MSG":
            return state;
        break;
    }

    return state;
}

const userReducer = (state = chatUserInitialState, action) => {            
    switch(action.type){
        case "USER_SET_NAME":            
            if(!action.name || action.name.length == 0){
                action.name = "Anonymous";
            }            
            return Object.assign({}, ...state, {userName: action.name});
        break
    }
    return state;
}

const reducers = combineReducers({
    chatState: userReducer,
    messages: messagesReducer
});

const store = createStore(reducers);

export default store;