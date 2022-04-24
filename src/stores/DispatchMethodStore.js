import Parse from 'parse'
import BaseStore from './BaseStore'

const DispatchMethod = Parse.Object.extend('DispatchMethod')

export default class DispatchMethodStore extends BaseStore {
  
  newQueryInstance() {
    return new Parse.Query(DispatchMethod).addAscending('description')
  }

  addSearchToQuery(query) {
    if (!this.searchString) {
      return query
    }
    const regex = new RegExp(`${this.searchString}`)
    query.matches('description', regex, 'i')
    return query
  }

}