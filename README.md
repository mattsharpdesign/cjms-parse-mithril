# cjms-parse-mithril

Rewrite of the CoatingJMS app using Parse Server and MithrilJS



## Notes on Parse Server
On starting, Parse server creates these collections on the configured database:
* _Idempotency
    - Empty at first. I actually don't know what this is for.
* _Role
* _SCHEMA
    - Model definitions. Initially contains only the special Parse models: _User and _Role. Defines field types (string, object, etc) and metadata like 'required'. Deleting a doc from here removes it from Parse Server and the dashboard.
* _User

After creating models in the Parse dashboard (or just by using Parse server) their definitions will be added to the _SCHEMA collection.



## Fixing up the database

### Copy the current db to one used for dev
```
mongodump --archive --db=cjms | mongorestore --archive  --nsFrom='cjms.*' --nsTo='cjms_dev.*'
```

### Parse Server needs _id to be a string
We can't modify _id so we need to create a new collection. May as well use the Parse convention of capitalized, singular model name.
```
db.powders.find().forEach(doc => {
    doc._id = doc._id.str
    db.Powder.insert(doc)
})

```

### Keeping compatiblity with existing app
We need to change the collection property in each collection class to the new name. eg `$this->collection = 'Powder';`

I changed the `AbstractCollection::getNewId` method to return a string instead of a MongoId object.

Also, requests on a specific object (getOne, update, delete methods) no longer need to convert the string $id argument to a MongoId object. Don't forget `Job::flagAsPrinted`.

Finally, the AngularJS app is still expecting a serialized MongoId object (`_id: { $id: 'somestring' }`). We can fix that in the `AbstractCollection::getOne` and `AbstractCollection::getMany` methods.

So, by touching only files in the `public/api/classes` directory, we can have a Parse compatible db and still use the existing app (PHP backend AND AngularJS frontend).
