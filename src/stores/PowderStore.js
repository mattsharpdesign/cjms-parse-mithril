import Parse from 'parse'
import BaseStore from './BaseStore'

const Powder = Parse.Object.extend('Powder')

export default class PowderStore extends BaseStore {
  
  newQueryInstance() {
    return new Parse.Query(Powder).addAscending('colour')
  }

  addSearchToQuery(query) {
    if (!this.searchString) {
      return query
    }
    const regex = new RegExp(`${this.searchString}`)
    query.matches('colour', regex, 'i')
    return query
  }

  get powders() {
    return this.items
  }

}