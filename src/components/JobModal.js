import m from 'mithril'
import processesConfig from '../processes-config'

function JobModal() {
  return {
    view({ attrs: { job, close } }) {
      function handleSubmit(e) {
        e.preventDefault()
        console.log(job)
        close()
      }
      return m('.ui active large modal', [
        m('.header', job.isNew() ? 'New Job' : `Job ${job.get('jobNum')}`),
        m('.scrolling content', [
          m('form.ui form', [
            
            m('.field', [
              m('.ui huge fluid left icon input', [
                m('i.pencil icon'),
                m('input[type=text][placeholder=Job description...]', {
                  value: job.get('description'),
                  oninput: e => job.set('description', e.target.value),
                }),
              ]),
            ]),

            m('.ui visible warning icon message', [
              m('i.user icon'),
              m('.content', [
                m('.header', 'Select customer'),
                'Customer is required'
              ])
            ]),

            m('.fields', [
              m('.four wide field', [
                m('label', 'Order Date'),
                m('input[type=date]', {
                  value: job.get('orderDate').toISOString().slice(0, 10)
                })
              ]),
              m('.four wide field', [
                m('label', 'Due Date'),
                m('input[type=date]', {
                  value: job.get('dueDate').toISOString().slice(0, 10)
                })
              ]),
              m('.eight wide field', [
                m('label', 'Order Number'),
                m('input[type=text]', {
                  value: job.get('orderNum'),
                  oninput: e => job.set('orderNum', e.target.value),
                })
              ]),
            ]),

            // Processes
            m('h4.ui top attached header', 'Processes'),
            processesConfig.map(p => {
              const jobP = job.get(p.id)
              return m('.ui attached segment', [
                m('.ui toggle checkbox', [
                  m('input[type=checkbox]'),
                  m('label', p.heading)
                ]),
              ])
            }),

            // Job items
            m('h4.ui top attached header', 'Items'),
            job.has('items') ? job.get('items').map(i => m('.ui attached segment', [
              i.description
            ])) : m('.ui attached secondary segment', 'No items have been added.'),
            m('.ui bottom attached segment', 'Add an item')


          ])
        ]),

        m('.actions', [
          m('button.ui primary button', {
            onclick: handleSubmit
          }, 'Save and close'),
          job.dirty() &&
            m('button[type=button].ui button', {
              onclick: () => job.revert()
            }, 'Undo changes'),
        ])
      ])
    }
  }
}

export default JobModal