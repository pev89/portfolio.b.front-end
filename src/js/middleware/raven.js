import { SENTRY_DSN } from '../config'
import Raven from 'raven-js'

const release = __webpack_hash__ // eslint-disable-line camelcase, no-undef

Raven.config(SENTRY_DSN, { release }).install()

export default function (store) {
  const initialState = store.getState()

  if (initialState.authentication.isAuthenticated) {
    handleAuthentication(initialState)
  }

  return next => action => {
    const oldState = store.getState()
    const context = { extra: { state: oldState, action } }
    // don't use Raven.wrap() as it will permanently modify next()
    const result = Raven.context(context, () => next(action))
    const newState = store.getState()
    switch (action.type) {
      case 'STORE_TOKEN':
        handleAuthentication(newState)
        break
      case 'LOGOUT':
        handleLogout()
        break
      // no default
    }
    return result
  }
}

function handleAuthentication(newState) {
  const email = newState.authentication.user.email
  Raven.setUserContext({ email })
}

function handleLogout() {
  Raven.setUserContext()
}