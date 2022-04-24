import m from 'mithril'
import handleParseError from '../handleParseError'

export default class BaseStore {

  items = []
  isLoading = false
  lastLoadedAt = null
  count = null
  error = null
  searchString = ''

  _query // the current query so it can be cancelled later if required



  /**
   * Get a new instance of the query used to get data from this collection
   * 
   * @returns Parse.Query
   */
  newQueryInstance() {
    throw new Error('Stores must define newQueryInstance()')
  }
  
  
  newItemInstance() {
    throw new Error('Stores must define newItemInstance()')
  }



  get hasError() {
    return this.error ? true : false
  }

  get hasMore() {
    return this.count > this.items.length
  }



  load(options = {}) {

    if (this._query) {
      this._query.cancel()
    }

    this.isLoading = true
    
    this._query = this.newQueryInstance()

    this._query = this.addSearchToQuery(this._query)

    this._query = this.addSortingToQuery(this._query)
    
    if (options.skip) {
      this._query.skip(options.skip)
    }

    this._query.withCount()

    this._query.find()
      .then((response) => {
        const results = response.results || response
        const count = response.count || null
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



  addSearchToQuery(query) {
    return query
  }



  addSortingToQuery(query) {
    return query
  }



  handleError(e) {
    if (!handleParseError(e)) {
      this.error = e.message
    }
  }



  setSearchString(value) {
    this.searchString = value
    this.load()
  }

}