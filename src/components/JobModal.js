import m from 'mithril'
import processesConfig from '../processes-config'
import { forHtmlInput, fromHtmlInput } from '../date-functions'
import Modal from './Modal'
import CustomerSelector from './CustomerSelector'

function JobModal({ attrs: { job } }) {
  let isCustomerSelectorOpen = false

  return {
    onremove() {
      console.log('removing job modal')
      if (job.dirty()) {
        job.revert()
        m.redraw()
      }
    },

    onbeforeupdate() {
      if (m.route.param('selectCustomer')) {
        isCustomerSelectorOpen = true
      } else {
        isCustomerSelectorOpen = false
      }
    },

    view({ attrs: { job, close } }) {
      
      function handleSubmit(e) {
        e.preventDefault()
        // const isNew = job.isNew()
        console.log(job)
        // if (!isNew) {
        //   close()
        // }
      }

      return m('[', [
        isCustomerSelectorOpen && (
          m(Modal, m(CustomerSelector, { 
            close: () => window.history.back(),
            onSelect: customer => {
              job.setCustomer(customer)
              window.history.back()
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
                    // onclick: () => isCustomerSelectorOpen = true
                    onclick: () => {
                      m.route.set(`${m.route.get()}?selectCustomer=true`)
                    }
                  }, job.has('customer') ? 'Change customer' : 'Select customer'),
                ])
              ]),

              // Job description
              m('.field', [
                m('.ui huge fluid input left icon', [
                  m('i.info icon'),
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
                    oninput: e => {
                      job.set('orderNum', e.target.value)
                      job.validateOrderNumber().then(() => m.redraw())
                    },
                  })
                ]),
              ]),

              job.orderNumberCount > 0 && [
                m('.ui visible warning message',
                  `Customer seems to already have ${job.orderNumberCount}
                  ${job.orderNumberCount > 1 ? 'orders' : 'order'}
                  with that order number.`
                )
              ],

              // Processes
              m('h4.ui top attached header', 'Processes'),
              processesConfig.map(process => {
                return m('.ui attached segment', [
                  m('span.process-heading', process.heading),
                  m(process.formControlComponent, { job, processKey: process.id })
                ])
              }),

              // Flags (urgent, qa)
              m('.fields', {
                style: { paddingTop: '28px' },
              }, [
                m('.field', {
                  style: { marginRight: '42px' },
                }, [
                  m('.ui toggle checkbox', {
                    class: job.get('isUrgent') ? 'checked' : '',
                  }, [
                    m('input[type=checkbox]', {
                      checked: job.has('isUrgent') && job.get('isUrgent') === true,
                      onclick: () => job.set('isUrgent', job.get('isUrgent') ? false : true),
                    }),
                    m('label', 'Urgent'),
                  ]),
                ]),
                m('.field', [
                  m('.ui toggle checkbox', [
                    m('input[type=checkbox]', {
                      checked: job.has('qc') && job.get('qc') === true,
                      onclick: () => job.set('qc', job.get('qc') ? false : true),
                    }),
                    m('label', 'QC Required'),
                  ]),
                ]),
              ]),

              // Job items
              m('h4.ui top attached header', 'Items'),
              m('.ui attached segment', {
                class: !job.has('items') ? 'secondary' : '',
              }, [
              
                job.has('items') && m('.ui divided items', [
                  job.get('items').map(item => m('.item', [
                    m('.content', [
                      m('.ui label', `${item.qty}x`),
                      ' ',
                      item.description,
                    ])
                  ]))
                ]),
              
                !job.has('items') && 'No items have been added.',
              ]),
              
              m('.ui bottom attached secondary segment', [
                m('a[href]', 'Add an item'),
              ]),

              // Notes
              m('textarea[placeholder=Notes][rows=3]', {
                value: job.get('notes'),
                oninput: e => job.set('notes', e.target.value),
              }),

              // Costing area
              !job.isNew() && m('[', [
                m('h4.ui top attached header', 'Costing'),
                m('.ui attached segment', 'TODO...'),
              ]),

            ])
          ]),

          m('.actions', [
            
            (job.dirty() || job.isNew()) && [
              m('button.ui primary button', {
                onclick: handleSubmit,
                disabled: !job.isReadyToSave(),
              }, 'Save'),
            ],
            
            (job.dirty() && !job.isNew()) && [
              m('button[type=button].ui button', {
                onclick: () => job.revert()
              }, 'Undo changes')
            ],
            
            (!job.dirty() || job.isNew()) && [
              m('.ui button', {
                onclick: () => close()
              }, job.isNew() ? 'Cancel' : 'Close')
            ]

          ])
        ])
      ])
    }
  }
}

export default JobModal