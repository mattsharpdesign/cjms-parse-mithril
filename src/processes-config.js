import m from 'mithril'
import PowderSelector from './components/PowderSelector'
import Modal from './components/Modal'
export default [
  {
    id: 'waterjet',
    heading: 'Waterjet'
  },
  {
    id: 'flashing',
    heading: 'Flashings',
  },
  {
    id: 'pretreatment',
    heading: 'Pretreatment',
    describeWith: job => {
      if (!(job.has('pretreatment'))) {
        return 'Not required'
      }
      return job.get('pretreatment').description
    }
  },
  {
    id: 'coating',
    heading: 'Coating',
    // describeWith: job => {
    //   if (!(job.has('coating'))) {
    //     return 'Not required'
    //   }
    //   return job.get('coating').powder.colour
    // },
    adminComponent: function () {
      let isModalOpen = false

      return {
        view({ attrs: { job } }) {
          let string
          if (job.has('coating') && job.get('coating').powder) {
            string = job.get('coating').powder.colour
          } else {
            string = 'Not required'
          }
          return m('[', [
            isModalOpen && m(Modal, m(PowderSelector, {
              close: () => isModalOpen =false,
              onSelect: powder => {
                job.setPowder(powder)
                isModalOpen = false
              },
            })),
            // m('span', string),
            m('a[href]', {
              onclick: e => {
                e.preventDefault()
                isModalOpen = true
              }
            }, string)
          ])
        }
      }
    }
  },
  {
    id: 'dispatch',
    heading: 'QA/Dispatch',
    // describeWith: job => {
    //   return job.get('dispatch').description
    // },
    adminComponent: {
      view({ attrs: { job } }) {
        return m('[', [
          m('a[href]', job.get('dispatch').description)
        ])
      }
    }
  },
]