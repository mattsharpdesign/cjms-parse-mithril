import BaseStore from './BaseStore'

export default class CustomerStore extends BaseStore {
  
  get customers() {
    return this.items
  }

}