import JobDispatchControl from './components/JobDispatchControl'
import JobCoatingControl from './components/JobCoatingControl'
import DefaultJobProcessControl from './components/DefaultJobProcessControl'

export default [
  {
    id: 'waterjet',
    heading: 'Waterjet',
    formControlComponent: DefaultJobProcessControl,
  },
  {
    id: 'flashing',
    heading: 'Flashings',
    formControlComponent: DefaultJobProcessControl,
  },
  {
    id: 'pretreatment',
    heading: 'Pretreatment',
    formControlComponent: DefaultJobProcessControl,
  },
  {
    id: 'coating',
    heading: 'Coating',
    formControlComponent: JobCoatingControl,
  },
  {
    id: 'dispatch',
    heading: 'QA/Dispatch',
    formControlComponent: JobDispatchControl,
  },
]