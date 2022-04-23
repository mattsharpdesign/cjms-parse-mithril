import Parse from 'parse'

const Auth = {

  error: null,
  isLoggingIn: false,

  current: Parse.User.current,

  logIn(username, password) {
    Auth.isLoggingIn = true
    return Parse.User.logIn(username, password)
      .then(() => Auth.error = null)
      .catch(e => Auth.error = e.message)
      .finally(() => Auth.isLoggingIn = false)
  },

  logOut: Parse.User.logOut,
  
}

export default Auth