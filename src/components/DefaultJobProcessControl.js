import m from 'mithril'

export default function() {

  function view({ attrs: { job, processKey }}) {

    let required = job.has(processKey) && job.get(processKey).required

    return m('.ui toggle checkbox', [
      m('input[type=checkbox]', {
        checked: required,
        onclick: () => job.set(
          `${processKey}.required`, 
          required ? false : true
        ),
      }),
      m('label', required ? 'Required' : 'Not required'),
    ])
  }

  return {
    view,
  }
}