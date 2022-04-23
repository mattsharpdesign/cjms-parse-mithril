import Parse from 'parse'
import CustomerStore from './CustomerStore'
import JobStore from './JobStore'
import PowderStore from './PowderStore'

const Customer = Parse.Object.extend('Customer')
const Powder = Parse.Object.extend('Powder')
const Job = Parse.Object.extend('Job')

export const customerStore = new CustomerStore(Customer)
export const powderStore = new PowderStore(Powder)
export const jobStore = new JobStore(Job)