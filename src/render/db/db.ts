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
        let coll = DB.getCollection('fileList')

        console.log('fileList', coll)
        if (!coll) {
          console.log('Collection %s does not exit. Creating ...', 'fileList')
          coll = DB.addCollection('fileList') // 初始化字段
          // _collection.insert({ name: `user_${new Date().getTime()}` })
          DB.saveDatabase()
        }

        const dv = coll.addDynamicView('a_complex_view')
        // console.log(dv)
        // console.log(dv.data())
        //
        // dv.applyWhere(function aCustomFilter(obj) {
        //   return true
        // })
        //
        // console.log(dv.data())

        resolve(dv.data())

        // console.log(_collection.data)
      })
    })
  }

  getConfigDB = () => {
    return this.cache[configDBName]
  }
}

const DB = new DBStore()

export default DB
