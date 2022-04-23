const notGone = new Parse.Query('Job').notEqualTo('dispatch.isGone', true)

const notInWaterjetQueue = Parse.Query.or(
  new Parse.Query('Job').notEqualTo('waterjet.required', true),
  new Parse.Query('Job').equalTo('waterjet.isFinished', true)
)

const notInFlashingQueue = Parse.Query.or(
  new Parse.Query('Job').notEqualTo('flashing.required', true),
  new Parse.Query('Job').equalTo('flashing.isFinished', true)
)

const notInPretreatmentQueue = Parse.Query.or(
  new Parse.Query('Job').equalTo('pretreatment', null),
  new Parse.Query('Job').equalTo('pretreatment.isFinished', true)
)

const notInCoatingQueue = Parse.Query.or(
  new Parse.Query('Job').equalTo('coating', null),
  new Parse.Query('Job').equalTo('coating.isFinished', true)
)

Parse.Cloud.beforeFind('Job', req => {

  // User has requested a specific queue of jobs
  if (req.query._where.queue) {
    
    let query

    switch (req.query._where.queue) {
      
      case 'waterjet':
        query = new Parse.Query('Job')
          .equalTo('waterjet.required', true)
          .notEqualTo('waterjet.isFinished', true)
          break
          
      case 'flashing':
        query = Parse.Query.and(
          notGone,
          notInWaterjetQueue,
          new Parse.Query('Job')
            .equalTo('flashing.required', true)
            .notEqualTo('flashing.isFinished', true)
        )
        break

      case 'pretreatment':
        query = Parse.Query.and(
          notGone,
          notInWaterjetQueue,
          notInFlashingQueue,
          new Parse.Query('Job')
            .notEqualTo('pretreatment', null)
            .notEqualTo('pretreatment.isFinished', true)
        )
        break

      case 'coating':
        query = Parse.Query.and(
          notGone,
          notInWaterjetQueue,
          notInFlashingQueue,
          notInPretreatmentQueue,
          new Parse.Query('Job')
            .notEqualTo('coating', null)
            .notEqualTo('coating.isFinished', true)
        )
        break

      case 'dispatch':
        query = Parse.Query.and(
          notGone,
          notInWaterjetQueue,
          notInFlashingQueue,
          notInPretreatmentQueue,
          notInCoatingQueue
        )
        break

      default:
        console.log('Unknown queue requested')

    }

    return query
  }

})