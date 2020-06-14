import jetpack from 'fs-jetpack'
import Loki from 'lokijs'

const configDBName = 'db/Main.json'

export interface IFile {
  fileType: '1' | '2'
  fileName: string
}

class DBStore {
  cache = {}
  private dynamicData?: DynamicView<any>

  appInit = (listen): Promise<DynamicView<any>> => {
    jetpack.dir(`db`)
    const DB = new Loki(configDBName, {
      persistenceMethod: 'fs',
    })
    this.cache[configDBName] = DB

    return new Promise((resolve, reject) => {
      DB.loadDatabase({}, error => {
        if (error) {
          reject(error)
        }

        let coll = DB.getCollection('fileList')

        console.log('fileList', coll)
        if (!coll) {
          console.log('Collection %s does not exit. Creating ...', 'fileList')
          coll = DB.addCollection('fileList', { autoupdate: true }) // 初始化字段
          // _collection.insert({ name: `user_${new Date().getTime()}` })
          DB.saveDatabase()
        }

        const dv = coll.addDynamicView('fileList')

        this.dynamicData = dv

        coll.on('insert', listen)

        // console.log(coll.events)
        // 可查看他的默认事件

        resolve(dv)

        // console.log(_collection.data)
      })
    })
  }

  getConfigDB = name => {
    return this.cache[name]
  }

  getBaseDB = (): Loki => {
    return this.cache[configDBName]
  }

  getFileView = () => {
    return this.dynamicData
  }

  addFile = (values: IFile) => {
    return new Promise((resolve, reject) => {
      const baseDB = DB.getBaseDB()
      const fileList: Collection<any> = baseDB.getCollection('fileList')
      fileList.insert(values)
      baseDB.saveDatabase(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

const DB = new DBStore()

export default DB
