import Parse from 'parse'
import CustomerStore from './CustomerStore'
import PowderStore from './PowderStore'

const Customer = Parse.Object.extend('Customer')

const Powder = Parse.Object.extend('Powder')

export const customerStore = new CustomerStore(Customer)
export const powderStore = new PowderStore(Powder)