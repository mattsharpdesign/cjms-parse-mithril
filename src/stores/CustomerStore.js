import Parse from 'parse'
import BaseStore from './BaseStore'

const Customer = Parse.Object.extend('Customer')

export default class CustomerStore extends BaseStore {
  
  get customers() {
    return this.items
  }

  newQueryInstance() {
    return new Parse.Query(Customer).addAscending('name')
  }

  addSearchToQuery(query) {
    if (this.searchString) {
      // query.fullText('name', this.searchString)
      // query.startsWith('name', this.searchString)
      const regex = new RegExp(`${this.searchString}`)
      query.matches('name', regex, 'i')
    }
    return query
  }

}