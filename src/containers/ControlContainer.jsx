import React from 'react'

import Control from '../components/Control'

class ControlContainer extends React.Component {
  constructor () {
    super()

    this.config = {
      maxSendPower: 500,
      sendDuration: 5000,
      messagePowerGainEaseFunc: function (t, b, c, d) {
        // Circular Out
        t /= d
        t--
        return c * Math.sqrt(1 - t * t) + b
      }
    }
  }
  render () {
    return (
      <Control {...this.config} />
    )
  }
}

export default ControlContainer
