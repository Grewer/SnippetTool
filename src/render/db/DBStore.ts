import jetpack from 'fs-jetpack'
import Loki from 'lokijs'
import IFileType from '~/enum/FileType'
import CreateDB from '~/db/createDB'

const configDBName = 'db/Main.json'

export interface IFile {
  fileType: IFileType
  fileName: string
}

class DBStore {
  cache = {}
  private dynamicData?: DynamicView<any>

  appInit = async (listen): Promise<DynamicView<any>> => {
    const db = await new CreateDB({ dbName: '123', view: true })

    console.log(db)

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

  getBaseDB = (): Loki => {
    return this.cache[configDBName]
  }

  getFileView = () => {
    return this.dynamicData
  }

  addFile = (values: IFile) => {
    return new Promise((resolve, reject) => {
      const baseDB = DBStore.getBaseDB()
      const fileList: Collection<any> = baseDB.getCollection('fileList')
      const fileListItem: {
        fileName: string
        fileType: IFileType
        path?: string
      } = {
        ...values,
      }
      if (values.fileType === IFileType.folder) {
        const name = `db/${values.fileName}.json`
        const DB = new Loki(name, {
          persistenceMethod: 'fs',
        })
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

          // console.log(_collection.data)
        })
        fileListItem.path = values.fileName
        this.cache[name] = DB
      }
      fileList.insert(fileListItem)
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

const BaseDBStore = new DBStore()

export default BaseDBStore
