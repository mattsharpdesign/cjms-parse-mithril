import m from 'mithril'
import PretreatmentMethodSelector from './PretreatmentMethodSelector'
import Dimmer from './Modal'

export default function() {
  let isSelectorOpen = false
  
  return {
    onbeforeupdate() {
      if (m.route.param('selectPretreatmentMethod')) {
        isSelectorOpen = true
      } else {
        isSelectorOpen = false
      }
    },
    view({ attrs: { job } }) {
      const modalUrl = `${m.route.get()}?selectPretreatmentMethod=true`
      const required = job.has('pretreatment')

      return m('[', [
        isSelectorOpen && m(Dimmer, m(PretreatmentMethodSelector, {
          close: () => window.history.back(),
          onSelect: method => {
            job.setPretreatmentMethod(method)
            // document.getElementById('job-form-delivery-address-input').focus()
            window.history.back()
          },
        })),

        m(m.route.Link, { href: modalUrl }, required ? job.get('pretreatment').description : 'Not required'),
        
      ])
    }
  }
}