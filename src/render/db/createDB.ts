import { v1 } from 'uuid'
import Loki from 'lokijs'
import IFileType from '~/enum/FileType'
import { IFileListItem } from '~/definition/Main'

/**
 * 封装事件操作
 */

export interface ICreateDB {
  dbName: string // dbName 约等于文件名
  insertListen?: () => void
  view: boolean
}

class CreateDB {
  private props: ICreateDB
  path = ''
  DB?: Loki
  dbName?: string

  constructor(props: ICreateDB) {
    this.props = props
  }

  static baseDBName = 'db/Main.json'

  init = async (): Promise<{
    DB: Loki
    view?: DynamicView<IFileListItem>
  }> => {
    const { dbName, insertListen, view } = this.props
    const path = `db/${dbName}.json`

    const db = new Loki(path, {
      persistenceMethod: 'fs',
    })

    this.DB = db
    this.dbName = dbName
    this.path = path

    return new Promise((resolve, reject) => {
      db.loadDatabase({}, error => {
        if (error) {
          reject(error)
        }

        let coll = db.getCollection('fileList')

        console.log('fileList', coll)

        if (!coll) {
          console.log('Collection %s does not exit. Creating ...', 'fileList')
          coll = db.addCollection('fileList', { autoupdate: true }) // 初始化字段
          db.saveDatabase(err => {
            err && reject(error)
          })
        }
        // insert: [ƒ]
        // update: []
        // pre-insert: []
        // pre-update: []
        // close: []
        // flushbuffer: []
        // error: []
        // delete: [ƒ]
        // warning: [ƒ]
        if (insertListen) {
          insertListen && coll.on('insert', insertListen)
          insertListen && coll.on('delete', insertListen)
        }

        resolve({ DB: db, view: view ? coll.addDynamicView('fileList') : undefined })
      })
    })
  }

  addFile = async (values: Pick<IFileListItem, 'fileType' | 'fileName'>, DB: Loki) => {
    console.log(DB)

    const fileList: Collection<IFileListItem> = DB.getCollection('fileList')
    const fileListItem: IFileListItem = {
      ...values,
    } as IFileListItem

    // 文件夹
    if (fileListItem.fileType === IFileType.folder) {
      const createDB = new CreateDB({ dbName: values.fileName, view: false })
      await createDB.init()
      fileListItem.path = createDB.path
    } else {
      // 文件
      fileListItem.content = ''
      fileListItem.dbName = DB.filename
    }

    fileListItem.parentIds = [] // 这里如果是全局的话就为空数组, 子文件需要加 id

    fileListItem.id = v1()

    fileList.insert(fileListItem)

    return new Promise((resolve, reject) => {
      console.log('saveDatabase', this.DB)
      this.DB?.saveDatabase(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  removeFile = (DB, item) => {
    const fileList: Collection<IFileListItem> = DB.getCollection('fileList')
    fileList.remove(item)

    return new Promise((resolve, reject) => {
      console.log('saveDatabase', this.DB)
      DB.saveDatabase(err => {
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
