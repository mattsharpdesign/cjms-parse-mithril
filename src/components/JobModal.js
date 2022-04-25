import m from 'mithril'
import processesConfig from '../processes-config'
import { forHtmlInput, fromHtmlInput } from '../date-functions'
import Dimmer from './Modal'
import CustomerSelector from './CustomerSelector'
import JobItemForm from './JobItemForm'

function JobModal({ attrs: { job } }) {
  console.log(job)
  
  let isCustomerSelectorOpen = false
  let isItemFormOpen = false
  let itemIndex

  return {

    oninit() {
      if (m.route.param('selectCustomer')) {
        isCustomerSelectorOpen = true
      } else {
        isCustomerSelectorOpen = false
      }
      if (m.route.param('editItem')) {
        itemIndex = Number(m.route.param('editItem'))
        isItemFormOpen = true
      } else {
        // itemIndex = null
        isItemFormOpen = false
      }
    },

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
      
      if (m.route.param('editItem')) {
        itemIndex = Number(m.route.param('editItem'))
        isItemFormOpen = true
      } else {
        // itemIndex = null
        isItemFormOpen = false
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
          m(Dimmer, m(CustomerSelector, { 
            close: () => window.history.back(),
            onSelect: customer => {
              job.setCustomer(customer)
              window.history.back()
              document.getElementById('job-form-description-input').focus()
            }
          }))
        ),

        isItemFormOpen && (
          m(Dimmer, m(JobItemForm, { 
            // job,
            // item,
            item: job.get('items')[itemIndex],
            // onEdit: () => {
            //   console.log(job.get('items')[itemIndex])
            // },
            whenDone: () => {
              let clone = job.get('items').map(x => x)
              console.log(itemIndex)
              clone[itemIndex].description = 'fart'

              job.set('items', clone)
              m.redraw()
            },
            close: () => {
              // let items = job.get('items')
              // items[itemIndex] = modifiedItem
              // job.set('items', items)
              
              window.history.back()
            },
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
                style: { paddingTop: '28px', paddingBottom: '42px' },
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
              m('h4.ui top attached segment', 'Job Items'),
              m(JobItemsTable, {
                items: job.get('items'),
                onRemove: item => job.remove('items', item),
                onEdit: (item, _index) => {
                  const itemsCopy = job.get('items').map(i => ({ ...i }))
                  const index = itemsCopy.findIndex(i => i.id === item.id)
                  itemsCopy[index] = item
                  job.set('items', itemsCopy)
                  // m.redraw()
                }
              }),

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
                onclick: () => {
                  console.log(job.dirtyKeys())
                  job.revert()
                }
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

function JobItemsTable() {
  return {
    view({ attrs: { items, onRemove, onEdit } }) {
      return m('table.ui compact attached table', [
        m('thead', [
          m('tr', [
            m('th'),
            m('th', 'Description'),
            m('th', 'Qty'),
            m('th'),
          ])
        ]),
        m('tbody', items.map((item, index) => m(JobItemsTableRow, { item, index, onRemove, onEdit })))
      ])
    }
  }
}

function JobItemsTableRow({ attrs: { item } }) {
  let isEditing = false
  let clone = { ...item }
  return {
    view({ attrs: { item, index, onRemove, onEdit } }) {
      if (isEditing) {
        return m('tr', [
          m('td', index + 1),
          m('td', m('.ui small fluid input', [
            m('input[type=text]', {
              value: clone.description,
              oninput: e => clone.description = e.target.value
            })
          ])),
          m('td', m('.ui small fluid input', [
            m('input[type=number]', {
              value: clone.qty,
              oninput: e => clone.qty = Number(e.target.value)
            })
          ])),
          m('td', [
            m('.ui small button', { 
              onclick: () => {
                onEdit(clone, index)
                isEditing = false
              }
            }, 'Done')
          ])
        ])
      }
      return m('tr', [
        m('td', index + 1),
        m('td', item.description),
        m('td', item.qty),
        m('td', [
          m('.ui small icon button', { onclick: () => isEditing = true }, m('i.pencil icon')),
          m('.ui small icon button', m('i.remove icon', {
            onclick: () => onRemove(item)
          })),
        ])
      ])
    }
  }
}

/* 
function JobItems() {

  let isItemFormOpen = false
  let selectedItem

  return {
    view({ attrs: { items, onRemove }}) {
      
      // function editItem(index) {
      //   m.route.set(`${m.route.get()}?editItem=${index}`)
      // }

      return m('[', [

        m('h4.ui top attached header', 'Items'),
        m('.ui attached segment', {
          class: !items.length > 0 ? 'secondary' : '',
        }, [
        
          items.length > 0 && m('.ui divided items', [
            items.map((item, index) => m(JobItemRow, { item, index, onRemove }))
          ]),
        
          !items.length > 0 && 'No items have been added.',
        ]),
        
        m('.ui bottom attached secondary segment', [
          m('a[href]', 'Add an item'),
        ]),
      ])
    }
  }
}
 */

/* 
function JobItemRow() {

  return {

    view({ attrs: { item, index, onRemove }}) {
      function editItem() {
        // item.description = 'test'
        m.route.set(`${m.route.get()}?editItem=${index}`)
      }
      return m('[', [


        m('.item', {
          // key: index,
        }, [
          m('.content', [
            m('.ui label', `${item.qty}x`),
            ' ',
            item.description,
            m('.ui right floated icon button', {
              onclick: () => {
                onRemove(item)
              }
            }, [
              m('i.remove icon')
            ]),
            m('.ui  right floated icon button', {
              onclick: () => editItem()
            // m(m.route.Link, {
            //   class: 'ui right floated icon button',
            //   href: `${m.route.get()}?editItem=${index}`
            }, [
              m('i.pencil icon')
            ]),
          ])
        ])
      ])
    }
  }
}
*/

export default JobModal