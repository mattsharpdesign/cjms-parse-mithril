import Parse from 'parse'
import Auth from './stores/Auth'

export default function handleParseError(err) {
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Auth.error = err.message
      Auth.logOut()
      break
    default:
      return false
  }
  return true
}