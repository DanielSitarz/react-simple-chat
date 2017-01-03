import { createStore, combineReducers } from 'redux';

const chatUserInitialState = {
    userName: "Dan",
    usersInRoom: [],
    currentRoomId: "DogsLovers",   
}

const chatMessagesInitialState = [
    {
        key: 0,            
        sender: "Dan",
        content: "Hey!",
        power: 1.0
    }
];

const messagesReducer = (state = chatMessagesInitialState, action) => {            
    switch(action.type){
        case "ADD_MSG":             
            return [...state, action.msg];
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