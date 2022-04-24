import m from 'mithril'
import processesConfig from '../processes-config'
import { forHtmlInput, fromHtmlInput } from '../date-functions'
import Modal from './Modal'
import CustomerSelector from './CustomerSelector'

function JobModal() {
  let isCustomerSelectorOpen = false

  return {
    view({ attrs: { job, close } }) {
      function handleSubmit(e) {
        e.preventDefault()
        console.log(job)
        close()
      }

      return m('[', [
        isCustomerSelectorOpen && (
          m(Modal, m(CustomerSelector, { 
            close: () => isCustomerSelectorOpen = false,
            onSelect: customer => {
              job.setCustomer(customer)
              isCustomerSelectorOpen = false
              document.getElementById('job-form-description-input').focus()
            }
          }))
        ),
        m('.ui active large modal', [
          m('.header', job.isNew() ? 'New Job' : `Job ${job.get('jobNum')}`),
          m('.scrolling content', [
            m('form.ui form', [
              
              // Customer
              m('.ui visible icon message', {
                class: job.has('customer') ? 'info' : 'warning'
              }, [
                m('i.user icon'),
                m('.content', [
                  m('.header', job.has('customer') ? job.get('customer').name : 'Customer is required'),
                  m('.selectable', {
                    onclick: () => isCustomerSelectorOpen = true
                  }, job.has('customer') ? 'Change customer' : 'Select customer'),
                ])
              ]),

              // Job description
              m('.field', [
                m('.ui huge fluid left icon input', [
                  m('i.pencil icon'),
                  m('input[type=text][placeholder=Job description...][id=job-form-description-input]', {
                    value: job.get('description'),
                    oninput: e => job.set('description', e.target.value),
                  }),
                ]),
              ]),

              // Order number and dates
              m('.fields', [
                m('.four wide field', [
                  m('label', 'Order Date'),
                  m('input[type=date]', {
                    value: forHtmlInput(job.get('orderDate')),
                    onchange(e) {
                      job.setOrderDate(fromHtmlInput(e.target.value))
                    }
                  })
                ]),
                m('.four wide field', [
                  m('label', 'Due Date'),
                  m('input[type=date]', {
                    value: forHtmlInput(job.get('dueDate')),
                    onchange(e) {
                      job.set('dueDate', fromHtmlInput(e.target.value))
                    }
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

              // Flags (urgent, qa)

              // Job items
              m('h4.ui top attached header', 'Items'),
              job.has('items') ? job.get('items').map(i => m('.ui attached segment', [
                i.description
              ])) : m('.ui attached secondary segment', 'No items have been added.'),
              m('.ui bottom attached segment', 'Add an item')

              // Notes

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
      ])
    }
  }
}

export default JobModal