import m from 'mithril'
import Modal from './Modal'
import PowderSelector from './PowderSelector'

export default function () {
  let isModalOpen = false

  return {
    onbeforeupdate() {
      if (m.route.param('selectPowder')) {
        isModalOpen = true
      } else {
        isModalOpen = false
      }
    },

    view({ attrs: { job } }) {
      const required = job.has('coating') && job.get('coating').powder
      const modalUrl = `${m.route.get()}?selectPowder=true`

      return m('[', [
        isModalOpen && m(Modal, m(PowderSelector, {
          close: () => window.history.back(),
          onSelect: powder => {
            job.setPowder(powder)
            window.history.back()
          },
        })),
        m(m.route.Link, {
          href: modalUrl,
        }, required ? powderDescription(job.get('coating').powder) : 'Not required')
      ])
    }
  }
}

function powderDescription(powder) {
  return `${powder.colour} (${powder.manufacturer} ${powder.code})`
}