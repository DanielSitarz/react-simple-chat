import React from 'react'
import { connect } from 'react-redux'

import Header from '../components/Header'

class HeaderContainer extends React.Component {
  render () {
    return (
      <Header userName={this.props.userName} roomName={this.props.roomName} />
    )
  }
}

const mapStateToProps = function (store) {
  return {
    userName: store.chatState.userName,
    roomName: store.chatState.roomName
  }
}

export default connect(mapStateToProps)(HeaderContainer)
