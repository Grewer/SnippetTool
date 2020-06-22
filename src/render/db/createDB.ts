import Loki from 'lokijs'
import IFileType from '~/enum/FileType'
import BaseDBStore, { IFile } from '~/db/DBStore'

interface IProps {
  dbName: string
  insertListen?: () => void
  view: boolean
}

class CreateDB {
  private props: IProps
  path = ''
  DB?: LokiConstructor
  dbName?: string

  constructor(props: IProps) {
    this.props = props
  }

  init = (): Promise<any> => {
    // 类型 TODO
    const { dbName, insertListen, view } = this.props
    const path = `db/${dbName}.json`
    const NEWDB = new Loki(path, {
      persistenceMethod: 'fs',
    })
    this.dbName = dbName
    this.path = name
    return new Promise((resolve, reject) => {
      NEWDB.loadDatabase({}, error => {
        if (error) {
          reject(error)
        }

        let coll = NEWDB.getCollection('fileList')

        console.log('fileList', coll)

        if (!coll) {
          console.log('Collection %s does not exit. Creating ...', 'fileList')
          coll = NEWDB.addCollection('fileList', { autoupdate: true }) // 初始化字段
          // _collection.insert({ name: `user_${new Date().getTime()}` })
          NEWDB.saveDatabase()
        }

        insertListen && coll.on('insert', insertListen)

        this.DB = NEWDB
        // console.log(coll.events)
        // 可查看他的默认事件

        resolve({ DB: NEWDB, view: view && coll.addDynamicView('fileList') })
        // console.log(_collection.data)
      })
    })
  }

  addFile = async (values: IFile) => {
    const baseDB = BaseDBStore.getBaseDB()
    console.log(baseDB, BaseDBStore.getBaseDB)
    const fileList: Collection<any> = baseDB.getCollection('fileList')
    const fileListItem: {
      fileName: string
      fileType: IFileType
      path?: string
    } = {
      ...values,
    }
    if (values.fileType === IFileType.folder) {
      const createDB = new CreateDB({ dbName: values.fileName, view: false })
      await createDB.init()
      fileListItem.path = createDB.path
    }
    fileList.insert(fileListItem)

    return new Promise((resolve, reject) => {
      this.DB?.saveDatabase(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

export default CreateDB
