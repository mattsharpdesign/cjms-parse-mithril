import Parse from 'parse'
import BaseStore from './BaseStore'

export default class JobStore extends BaseStore {
  
  _currentQueue = 'flashing'
  
  get defaultQuery() {
    const query = new Parse.Query(this.itemClass)
    // query.notEqualTo('dispatch.isGone', true)
    query.equalTo('queue', this.currentQueue)
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