import Parse from 'parse'

class AuthStore {

  error = null
  isLoggingIn = false

  current = Parse.User.current

  logIn(username, password) {
    this.isLoggingIn = true
    return Parse.User.logIn(username, password)
      .then(() => this.error = null)
      .catch(e => this.error = e.message)
      .finally(() => this.isLoggingIn = false)
  }

  logOut = Parse.User.logOut

}

const authStore = new AuthStore()

export default authStore