import Parse from 'parse'
import m from 'mithril'
import handleParseError from '../handleParseError'

export default class BaseStore {
  items = []
  isLoading = false
  lastLoadedAt = null
  count = null
  error = null
  itemClass

  get hasError() {
    return this.error ? true : false
  }

  get hasMore() {
    return this.count > this.items.length
  }

  constructor(itemClass) {
    this.itemClass = itemClass
  }

  get defaultQuery() {
    return new Parse.Query(this.itemClass)
  }

  load(options = {}) {

    this.isLoading = true
    
    // const query = new Parse.Query(this.itemClass)
    const query = this.defaultQuery
    
    if (options.skip) {
      query.skip(options.skip)
    }

    query.withCount()

    query.find()
      .then(({ count, results }) => {
        if (options.append) {
          this.items = this.items.concat(results)
        } else {
          this.items = results
        }
        this.count = count
        this.lastLoadedAt = new Date()
        this.error = null
      })
      .catch(e => this.handleError(e))
      .finally(() => {
        this.isLoading = false
        m.redraw()
      })
  }

  loadMore() {
    return this.load({ skip: this.items.length, append: true })
  }

  handleError(e) {
    if (!handleParseError(e)) {
      this.error = e.message
    }
  }

}