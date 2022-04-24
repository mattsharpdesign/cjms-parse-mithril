import m from 'mithril'
import { jobStore as store } from '../stores'
import JobModal from './JobModal'
import ListHeader from './ListHeader'
import LoadMoreButton from './LoadMoreButton'
import Modal from './Modal'

const statusTabs = [
  { id: 'all', heading: 'All' },
  { id: 'unfinished', heading: 'Unfinished' },
  { id: 'finished', heading: 'Finished' },
  { id: 'approved', heading: 'Approved' },
  { id: 'invoiced', heading: 'Invoiced' },
]

function Jobs() {
  let selected = []
  let isModalOpen = false
  let currentJob = null

  function openModal(job = null) {

    currentJob = !job ? store.newItemInstance() : job
    isModalOpen = true
  }

  function closeModal() {
    isModalOpen = false
  }

  function toggleSelected(job) {
    const index = selected.findIndex(i => i === job.id)
    if (index === -1) {
      selected.push(job.id)
    } else {
      selected.splice(index, 1)
    }
  }

  function selectAll(items = []) {
    items.forEach(job => {
      if (!isSelected(job)) {
        selected.push(job.id)
      }
    })
  }

  function selectNone() {
    selected =[]
  }

  function isSelected(job) {
    return selected.includes(job.id)
  }

  return {
    oninit() {
      if (store.groupBy !== 'status') {
        store.setGroupBy('status')
      } else {
        if (!store.lastLoadedAt && !store.isLoading) store.load()
      }
    },
    view() {
      const items = store.items || []
      return m('[', [
        
        isModalOpen && (
          m(Modal, m(JobModal, {
            job: currentJob,
            close: closeModal
          }))
        ),

        m('.ui tabular menu', [
          statusTabs.map(s => m('.item', {
            class: s.id === store.status ? 'active' : '',
            onclick() {
              selectNone()
              store.setStatus(s.id)
            }
          }, s.heading))
        ]),

        m(ListHeader, { store }, [
          m('.link item', {
            onclick: () => openModal(),
          }, [
            m('i.plus icon')
          ]),
          selected.length > 0 && m('.ui simple dropdown item', [
            `With ${selected.length} selected`,
            m('i.dropdown icon'),
            m('.menu', [
              m('.item', 'Download as invoice data'),
            ])
          ]),
          m('.link item', {
            onclick() {
              if (selected.length > 0) {
                selectNone()
              } else {
                selectAll(items)
              }
            }
          }, m('i.check square icon', {
            class: selected.length > 0 ? '' : 'outline'
          })),
        ]),

        m('table.ui selectable table', [
          m('thead', [
            m('tr', [
              m('th', 'Job #'),
              m('th', 'Ordered'),
              m('th', 'Customer'),
              m('th', 'Description'),
              m('th', 'Due'),
              m('th', 'Order Number'),
              m('th', 'Status'),
            ])
          ]),
          m('tbody', items.map(job => m(TableRow, { 
            key: job.id,
            job, 
            onClick: toggleSelected,
            onDblClick: openModal,
            isSelected: isSelected(job),
          })))
        ]),

        m(LoadMoreButton, { store })
      ])
    }
  }
}

const TableRow = {
  view({ attrs: { job, isSelected, onClick, onDblClick } }) {
    return m('tr', {
      onclick: () => onClick(job),
      ondblclick: () => onDblClick(job),
      class: isSelected ? 'active' : '',
    }, [
      m('td', job.get('jobNum')),
      m('td', job.get('orderDate').toLocaleDateString()),
      m('td', job.get('customer').name),
      m('td', job.get('description')),
      m('td', job.get('dueDate').toLocaleDateString()),
      m('td', job.get('orderNum')),
      m('td'),
    ])
  }
}

export default Jobs