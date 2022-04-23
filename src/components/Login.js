import m from 'mithril'
import Auth from '../stores/Auth'

export default function() {

  let username = ''
  let password = ''

  function handleSubmit(e) {
    e.preventDefault()
    Auth.logIn(username, password).then(m.redraw)
  }

  return {
    view() {
      return m('form', {
        onsubmit: handleSubmit
      }, [
        m('.form-group', [
          m('label', 'Username'),
          m('input.form-control[type=text]', {
            value: username,
            oninput: e => username = e.target.value,
          }),
        ]),
        m('.form-group', [
          m('label', 'Password'),
          m('input.form-control[type=password]', {
            value: password,
            oninput: e => password = e.target.value,
          }),
        ]),
        Auth.error && m('.alert alert-danger', Auth.error),
        m('button.btn btn-block btn-primary', Auth.isLoggingIn ? 'Logging in...' : 'Log in')
      ])
    }
  }
}