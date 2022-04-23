import Parse from 'parse'
import BaseStore from './BaseStore'

const Job = Parse.Object.extend('Job')

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
  
  _currentQueue = 'flashing'
  
  newQueryInstance() {

    let query

    switch (this.currentQueue) {
      
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
    
    return query
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
        new Parse.Query(Job).matches('customer.name', regex, 'i')
      )
    )
  }
  
  addSortingToQuery(query) {
    query.addAscending('dueDate')
    return query
  }

  get currentQueue() {
    return this._currentQueue
  }

  set currentQueue(queue) {
    this._currentQueue = queue
    this.load()
  }

  get jobs() {
    return this.items
  }

}