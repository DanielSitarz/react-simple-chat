import React from 'react';
import store from '../../store/store';
import {Modal, Button, Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

import {browserHistory} from 'react-router';

class ChatNameSelectModal extends React.Component {
  constructor(props){
    super(props);                

    this.state = {
      name: store.getState().chatState.userName
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }  
  handleOnFocus(e){
    e.target.select();
  }  
  onChange(e){
    this.setState({
      name: e.target.value
    });
  }
  getValidationState(){
    const length = this.state.name.length;
    if (length > 0) return 'success';    
    else if (length == 0) return 'error';
  }
  onSubmit(e){
    e.preventDefault();    
    this.props.handleNameChange(this.state.name);
  }
  render() {
    return (
       <Modal show={this.props.show}>        
        <Modal.Body>
           <Form onSubmit={this.onSubmit}>
              <FormGroup                 
                controlId="changeNameForm" 
                validationState={this.getValidationState()} >
                <ControlLabel>Name</ControlLabel>
                {' '}
                <FormControl 
                  type="text" 
                  placeholder="Your new name"                   
                  value={this.state.name}
                  onChange={this.onChange}/>
              </FormGroup>                            
              {' '}
              <Button type="submit">
                Change your name
              </Button>
            </Form>
        </Modal.Body>        
      </Modal>        
    )
  }
}

export default ChatNameSelectModal;