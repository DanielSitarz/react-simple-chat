/* React */
import React from 'react'
import { Provider } from 'react-redux'

import store from './store/store'
import router from './router'

export default () => (
  <Provider store={store}>
    {router}
  </Provider>
)
