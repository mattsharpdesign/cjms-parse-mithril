import Parse from 'parse'
import BaseStore from './BaseStore'
import PretreatmentMethod from '../models/PretreatmentMethod'


export default class PretreatmentMethodStore extends BaseStore {
  
  newQueryInstance() {
    return new Parse.Query(PretreatmentMethod).addAscending('description')
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