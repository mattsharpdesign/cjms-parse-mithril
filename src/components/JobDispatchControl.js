import m from 'mithril'
import DispatchMethodSelector from './DispatchMethodSelector'
import Dimmer from './Modal'

export default function() {
  let isSelectorOpen = false
  
  return {
    onbeforeupdate() {
      if (m.route.param('selectDispatchMethod')) {
        isSelectorOpen = true
      } else {
        isSelectorOpen = false
      }
    },
    view({ attrs: { job } }) {
      const modalUrl = `${m.route.get()}?selectDispatchMethod=true`
      return m('[', [
        isSelectorOpen && m(Dimmer, m(DispatchMethodSelector, {
          close: () => window.history.back(),
          onSelect: method => {
            job.setDispatchMethod(method)
            // document.getElementById('job-form-delivery-address-input').focus()
            window.history.back()
          },
        })),

        m(m.route.Link, { href: modalUrl }, job.get('dispatch').description),
        
        job.get('dispatch').description !== 'Customer collect' && [
          m('textarea[rows=3][id=job-form-delivery-address-input]', {
            value: job.get('deliveryAddress'),
            oninput: e => job.set('deliveryAddress', e.target.value),
          })
        ]
      ])
    }
  }
}