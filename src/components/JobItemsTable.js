import m from 'mithril'
import JobItemForm from './JobItemForm';

/**
 * 
 * @attribute {Job} job
 * 
 */
 export default function JobItemsTable({ attrs: { job } }) {
  
  function removeItem(item) {
    console.log('removing item', item);
    job.remove('items', item)
  }

  function updateItem(origItem, updatedItem) {
    const index = job.get('items').findIndex(i => i === origItem)
    if (index === -1) {
      throw new Error('Could not find item in items array')
    }
    let itemsCopy = job.get('items').map(i => ({ ...i }))
    itemsCopy[index] = updatedItem
    console.log(itemsCopy);
    job.set('items', itemsCopy)
  }

  return {

    view() {
      return ('[', [
        m('h4.ui top attached segment', 'Job Items'),
        m('table.ui compact attached table', [
          m('thead', [
            m('tr', [
              m('th', 'Description'),
              m('th', 'Qty'),
              m('th', 'Rate'),
              m('th', 'Dimensions'),
              m('th', 'Each'),
              m('th', 'Total'),
              m('th'),
            ])
          ]),
          m('tbody', job.get('items').map((item) => m(JobItemsTableRow, {
            item,
            onRemove: removeItem,
            onEdit: updateItem,
          })))
        ]),
        m('.ui bottom attached secondary segment', [
          m('span.selectable', 'Add an item'),
        ]),
      ])
    }

  }

}

function JobItemsTableRow({ attrs: { item } }) {
  let isEditing = false
  
  return {
    view({ attrs: { item, onRemove, onEdit } }) {
      if (isEditing) {
        return m(CelledEditableTableRow, { item, onEdit, stopEditing: () => isEditing = false })
        // return m('tr', [
        //   m('td[colspan=6]', m(JobItemForm, { item, onEdit, stopEditing: () => isEditing = false }))
        // ])
      }
      return m('tr', [
        m('td', item.description),
        m('td', item.qty),
        m('td', chargeRateAsString(item)),
        m('td', dimsAsString(item)),
        m('td', chargeEachAsString(item)),
        m('td', chargeTotalAsString(item)),
        m('td.right aligned', [
          m('.ui small icon button', {
            onclick: () => isEditing = true
          }, m('i.pencil icon')),
          m('.ui small icon button', {
            onclick: () => onRemove(item)
          }, m('i.remove icon')),
        ])
      ])
    }
  }
}

function chargeEachAsString(item) {
  return `$${item.chargeEach}`
}

function chargeTotalAsString(item) {
  return `$${item.chargeTotal}`
}

function SpannedEditableTableRow() {
  let clone
  return {
    oninit({ attrs: { item } }) {
      clone = JSON.parse(JSON.stringify(item))
    },
    view({ attrs: { item, onEdit, stopEditing }}) {
      return m('tr', [
        m('td[colspan=5]', [
          'form goes here...'
        ]),
        m('td.right aligned', [
          m('.ui small button', { 
            onclick: () => {
              onEdit(item, clone)
              stopEditing()
            }
          }, 'Done')
        ])
      ])
    }
  }
}

function CelledEditableTableRow() {
  let clone
  return {
    oninit({ attrs }) {
      const { item } = attrs
      clone = { ...item }
    },
    view({ attrs }) {
      const { item, onEdit, stopEditing } = attrs
      return m('tr', [
        // m('td', index + 1),
        m('td', m('.ui small fluid input', [
          m('input[type=text]', {
            // style: { minWidth: '170px' },
            value: clone.description,
            oninput: e => clone.description = e.target.value
          }),
          m('br'),
          m('.selectable', 'Select repeat job'),
        ])),
        m('td', m('.ui small quantity input', [
          m('input[type=number]', {
            value: clone.qty,
            oninput: e => clone.qty = Number(e.target.value)
          })
        ])),
        m('td', 'rate...............'),
        m('td', m(DimensionsInputs, { item: clone })),
        m('td', 'charge.............'),
        m('td.right aligned', [
          m('.ui small button', { 
            onclick: () => {
              onEdit(item, clone)
              stopEditing()
            }
          }, 'Done')
        ])
      ])
    }
  }
}

const DimensionsInputs = {
  view({ attrs: { item }}) {
    return m('[', [
      m('.ui tiny icon dimensions input', [
        m('input[type=number][placeholder=X mm]', {
          // style: { width: '110px' },
          value: item.dimensions ? item.dimensions.hasOwnProperty('x')
            ? item.dimensions.x : ''
            : '',
        }),
        m('i.arrows alternate horizontal icon')
      ]),
      m('br'),
      m('.ui icon dimensions input', [
        m('input[type=number][placeholder=Y mm]', {
          // style: { width: '110px' },
          value: item.dimensions ? item.dimensions.hasOwnProperty('y')
            ? item.dimensions.y : ''
            : '',
        }),
        m('i.arrows alternate vertical icon'),
      ])
    ])
  }
}

function chargeRateAsString(item) {
  return `$${item.rate.charge} per ${item.rate.units}`
}

function dimsAsString(item) {
  if (!item.dimensions || !item.dimensions.hasOwnProperty('x')) {
    return ''
  }
  if (!item.dimensions.hasOwnProperty('y')) {
    return `${item.dimensions.x} mm`
  }
  return `${item.dimensions.x} x ${item.dimensions.y} mm`
}