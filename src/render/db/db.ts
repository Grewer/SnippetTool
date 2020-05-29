import jetpack from 'fs-jetpack'
import Loki from 'lokijs'

const configDBName = 'db/Main.json'

class DBStore {
  cache = {}

  appInit = () => {
    jetpack.dir(`db`)
    const DB = new Loki(configDBName, {
      persistenceMethod: 'fs',
    })
    this.cache[configDBName] = DB

    return new Promise((resolve, reject) => {
      DB.loadDatabase({}, error => {
        let _collection = DB.getCollection('title')
        console.log('title', _collection)
        if (!_collection) {
          console.log('Collection %s does not exit. Creating ...', 'title')
          _collection = DB.addCollection('title') // 初始化字段
          _collection.insert({ name: `user_${new Date().getTime()}` })
          DB.saveDatabase()
        }

        resolve()

        console.log(_collection.data)
      })
    })
  }

  getConfigDB = () => {
    return this.cache[configDBName]
  }
}

const DB = new DBStore()

export default DB
