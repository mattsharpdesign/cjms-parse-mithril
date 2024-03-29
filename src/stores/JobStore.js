import Parse from 'parse'
import BaseStore from './BaseStore'
import Job from '../models/Job'

const notGone = new Parse.Query(Job).notEqualTo('dispatch.isGone', true)

const notInWaterjetQueue = Parse.Query.or(
  new Parse.Query(Job).notEqualTo('waterjet.required', true),
  new Parse.Query(Job).equalTo('waterjet.isFinished', true)
)

const notInFlashingQueue = Parse.Query.or(
  new Parse.Query(Job).notEqualTo('flashing.required', true),
  new Parse.Query(Job).equalTo('flashing.isFinished', true)
)

const notInPretreatmentQueue = Parse.Query.or(
  new Parse.Query(Job).equalTo('pretreatment', null),
  new Parse.Query(Job).equalTo('pretreatment.isFinished', true)
)

const notInCoatingQueue = Parse.Query.or(
  new Parse.Query(Job).equalTo('coating', null),
  new Parse.Query(Job).equalTo('coating.isFinished', true)
)

export default class JobStore extends BaseStore {
  
  view = ['queue', 'waterjet'] // [queue|admin, status, options?]

  groupBy = 'status' // or 'queue'
  status = 'all' // all|unfinished|finished|approved|invoiced
  queue = 'pretreatment'

  _orderNumQuery

  newItemInstance() {
    return new Job()
  }
  
  newQueryInstance() {

    let query

    if (this.groupBy === 'status') {

      switch (this.status) {

        case 'unfinished':
          query = new Parse.Query(Job).notEqualTo('isFinished', true)
          break

        case 'finished':
          query = new Parse.Query(Job)
            .equalTo('dispatch.isFinished', true)
            .notEqualTo('readyToInvoice', true)
            .notEqualTo('isInvoiced', true)            
          break

        case 'approved':
          query = new Parse.Query(Job)
            .equalTo('readyToInvoice', true)
            .notEqualTo('isInvoiced', true)
          break

        case 'invoiced':
          query = new Parse.Query(Job)
            .equalTo('isInvoiced', true)
          break

        case 'all':
        default:
          query = new Parse.Query(Job)
      }

    } else if (this.groupBy === 'queue') {

      switch (this.queue) {
        
        case 'waterjet':
          query = new Parse.Query(Job)
            .equalTo('waterjet.required', true)
            .notEqualTo('waterjet.isFinished', true)
            break

        case 'flashing':
          query = Parse.Query.and(
            notGone,
            notInWaterjetQueue,
            new Parse.Query(Job)
              .equalTo('flashing.required', true)
              .notEqualTo('flashing.isFinished', true)
          )
          break

        case 'pretreatment':
          query = Parse.Query.and(
            notGone,
            notInWaterjetQueue,
            notInFlashingQueue,
            new Parse.Query(Job)
              .notEqualTo('pretreatment', null)
              .notEqualTo('pretreatment.isFinished', true)
          )
          break

        case 'coating':
          query = Parse.Query.and(
            notGone,
            notInWaterjetQueue,
            notInFlashingQueue,
            notInPretreatmentQueue,
            new Parse.Query(Job)
              .notEqualTo('coating', null)
              .notEqualTo('coating.isFinished', true)
          )
          break

        case 'dispatch':
          query = Parse.Query.and(
            notGone,
            notInWaterjetQueue,
            notInFlashingQueue,
            notInPretreatmentQueue,
            notInCoatingQueue
          )
          break

        default:
          console.log('Unknown queue requested')
          throw new Error('Unknown queue requested')

      }

    } else {
      query = new Parse.Query(Job)
    }
    
    return query
  }

  findOrFetchByJobNum(jobNum) {
    console.log('finding job ', jobNum)
    let job = this.items.find(i => i.get('jobNum') === Number(jobNum))
    return Promise.resolve(job)
  }

  addSearchToQuery(query) {
    if (!this.searchString) {
      return query
    }
    const regex = new RegExp(`${this.searchString}`)
    return Parse.Query.and(
      query,
      Parse.Query.or(
        new Parse.Query(Job).matches('description', regex, 'i'),
        new Parse.Query(Job).matches('customer.name', regex, 'i'),
        new Parse.Query(Job).matches('orderNum', regex, 'i'),
        new Parse.Query(Job).equalTo('jobNum', Number(this.searchString))
      )
    )
  }
  
  addSortingToQuery(query) {
    query.addDescending('jobNum')
    // query.addAscending('dueDate')
    return query
  }

  setGroupBy(value) {
    this.groupBy = value
    this.load()
  }

  setStatus(status) {
    this.status = status
    this.load()
  }

  setQueue(queue) {
    this.queue = queue
    this.load()
  }

  validateOrderNumber(customerId, orderNum, excludeJobNum) {
    if (this._orderNumQuery) this._orderNumQuery.cancel()
    this._orderNumQuery = new Parse.Query(Job)
    this._orderNumQuery.equalTo('customer.id', customerId)
    this._orderNumQuery.equalTo('orderNum', orderNum)
    this._orderNumQuery.notEqualTo('jobNum', excludeJobNum)
    this._orderNumQuery.count().then(response => {
      console.log(response)
    })
  }

  get jobs() {
    return this.items
  }

}