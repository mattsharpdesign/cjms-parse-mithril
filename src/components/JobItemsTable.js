import m from 'mithril'

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
        return m(EditableRow, { item, onEdit, stopEditing: () => isEditing = false })
      }
      return m('tr', [
        m('td', item.description),
        m('td', item.qty),
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

function EditableRow() {
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