import CustomerStore from './CustomerStore'
import JobStore from './JobStore'
import PretreatmentMethodStore from './PretreatmentMethodStore'
import PowderStore from './PowderStore'
import DispatchMethodStore from './DispatchMethodStore'

export const customerStore = new CustomerStore()
export const jobStore = new JobStore()
export const pretreatmentMethodStore = new PretreatmentMethodStore()
export const powderStore = new PowderStore()
export const dispatchMethodStore = new DispatchMethodStore()