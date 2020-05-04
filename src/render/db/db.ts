import jetpack from 'fs-jetpack'
import Loki from 'lokijs'

export const appInit = () => {
  return new Promise((resolve, reject) => {
    jetpack.dir(`db`)
    const db = new Loki('db/Main.json', {
      persistenceMethod: 'fs',
    })

    db.loadDatabase({}, error => {
      let _collection = db.getCollection('title')
      console.log('title', _collection)
      if (!_collection) {
        console.log('Collection %s does not exit. Creating ...', 'title')
        _collection = db.addCollection('title') // 初始化字段
        _collection.insert({ name: `user_${new Date().getTime()}` })
        db.saveDatabase()
      }

      resolve()

      console.log(_collection.data)
      // callback(_collection);
    })
  })
}
