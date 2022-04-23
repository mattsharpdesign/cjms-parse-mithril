import BaseStore from './BaseStore'

export default class PowderStore extends BaseStore {
  
  get powders() {
    return this.items
  }

}