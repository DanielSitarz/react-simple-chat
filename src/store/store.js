import { createStore, combineReducers } from 'redux';
import _ from 'lodash/array';
import { List, Map } from 'immutable';

import randomNameGenerator from '../helpers/randomNameGenerator'

const chatUserInitialState = {
    userName: randomNameGenerator(),
    usersInRoom: [],
    roomName: "DogsLovers",    
}

const initialMessages = List();

const areTypingInitialState = [];

export const messagesReducer = (messages = initialMessages, action) => {            
    switch(action.type){
        case "SET_MSGS":                                            
            return List(action.msgs) || List();
        break;
        case "ADD_MSG":                        
            return messages.push(Map(action.msg));
        break;        
    }

    return messages;
}

export const areTypingReducer = (state = areTypingInitialState, action) => {
    switch(action.type){
        case "IS_TYPING":            
            return [...state, action.who];
        break;
        case "STOPPED_TYPING":
            return _.pull(state, action.who);
        break;
    }
    return state;
}

export const userReducer = (state = chatUserInitialState, action) => {            
    switch(action.type){
        case "USER_SET_NAME":            
            if(!action.name || action.name.length == 0){
                action.name = "Anonymous";
            }            
            return Object.assign(state, {userName: action.name});
        break
    }
    return state;
}

const reducers = combineReducers({
    chatState: userReducer,
    messages: messagesReducer,
    areTyping: areTypingReducer
});

const store = createStore(reducers);

export default store;