import React from 'react';

class HeaderContainer extends React.Component {
  render() {
    return (
      <header>
        <h1>{this.props.title}</h1>        
      </header>
    )
  }
}

export default HeaderContainer;