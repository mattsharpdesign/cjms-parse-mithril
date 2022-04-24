import Parse from 'parse'
import addBusinessDays from 'date-fns/addBusinessDays'

export default Parse.Object.extend('Job', {

  initialize(attrs, options) {
    this.setOrderDate(new Date()),
    this.set('dispatch', {
      description: 'Customer collect'
    })
  },

  isReadyToSave() {
    if (!this.has('customer')) {
      return false
    }
    if (!this.has('description') || !this.get('description').length) {
      return false
    }
    return true
  },

  validateOrderNumber() {
    if (this._orderNumQuery) this._orderNumQuery.cancel()
    if (!this.has('customer')) return
    this._orderNumQuery = new Parse.Query(Job)
    this._orderNumQuery.equalTo('customer.id', this.get('customer').id)
    this._orderNumQuery.equalTo('orderNum', this.get('orderNum'))
    if (this.has('jobNum')) {
      this._orderNumQuery.notEqualTo('jobNum', this.get('jobNum'))
    }
    return this._orderNumQuery.count().then((count) => {
      console.log(count)
      this.orderNumberCount = count
    })
  },

  setCustomer(customer) {
    this.set('customer', {
      id: customer.id,
      name: customer.get('name')
    })
    const dispatchMethod = customer.has('defaultDispatchMethod')
      ? customer.get('defaultDispatchMethod')
      : 'Customer collect'
    this.set('dispatch.description', dispatchMethod)
    this.set('deliveryAddress', customer.get('address'))
  },

  setOrderDate(date) {
    this.set('orderDate', date)
    this.set('dueDate', addBusinessDays(date, 3))
  },

  setPretreatmentMethod(method) {
    const description = method.get('description')
    if (!method || description === 'No pretreatment required') {
      this.set('pretreatment', null)
    } else {
      this.set('pretreatment.id', method.id)
      this.set('pretreatment.description', description)
    }
  },

  setPowder(powder) {
    if (powder) {
      this.set('coating.powder', {
        id: powder.id,
        manufacturer: powder.get('manufacturer'),
        colour: powder.get('colour'),
        code: powder.get('code'),
        pricePerKg: powder.get('pricePerKg'),
      })
    } else {
      this.set('coating', null)
    }
  },

  setDispatchMethod(method) {
    this.set('dispatch.id', method.id)
    this.set('dispatch.description', method.get('description'))
  }
})