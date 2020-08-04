import { v1 } from 'uuid'
import Loki from 'lokijs'
import IFileType from '~/enum/FileType'
import { IFileListItem, IFileListItemFile } from '~/definition/Main'

/**
 * 封装事件操作
 */

export interface ICreateDB {
  dbName: string // dbName 约等于文件名
  listen?: {
    insert?: (event) => void
    update?: (event) => void
    delete?: (event) => void
  }
  view: boolean
}

// pre-insert: []
// pre-update: []
// close: []
// flushbuffer: []
// error: []
// warning: [ƒ]

class CreateDB {
  private props: ICreateDB
  path = ''
  DB!: Loki
  dbName?: string

  constructor(props: ICreateDB) {
    this.props = props
  }

  static baseDBName = 'db/Main.json'

  init = async (): Promise<{
    view?: DynamicView<IFileListItem>
  }> => {
    const { dbName, listen, view } = this.props
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

        if (listen) {
          Object.keys(listen).forEach(listenName => {
            coll.on(listenName, listen[listenName])
          })
        }

        resolve({ view: view ? coll.addDynamicView('fileList') : undefined })
      })
    })
  }

  addFile = async (values: Pick<IFileListItem, 'fileType' | 'fileName'>) => {
    console.log(this.DB)

    const fileList: Collection<IFileListItem> = this.DB.getCollection('fileList')
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
      fileListItem.dbName = this.DB.filename
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

  removeFile = item => {
    const fileList: Collection<IFileListItem> = this.DB.getCollection('fileList')
    fileList.remove(item)

    return new Promise((resolve, reject) => {
      console.log('saveDatabase', this.DB)
      this.DB.saveDatabase(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  rename = (item: IFileListItemFile, value: { fileName: string }) => {
    item.fileName = value.fileName
    const coll = this.DB.getCollection('fileList')
    coll.update(item)
  }
}

export default CreateDB
