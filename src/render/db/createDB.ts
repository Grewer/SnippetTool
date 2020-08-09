import { v1 } from 'uuid'
import Loki from 'lokijs'
import { IFileListItem, IFileListItemFile, IFileListItemFolder } from '~/definition/Main'
import { baseDBName } from '~/config'

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

  // 初始就会创建 所以默认存在
  DB!: Loki
  dbName!: string
  path = ''

  constructor(props: ICreateDB) {
    this.props = props
  }

  init = async (): Promise<{
    view?: DynamicView<IFileListItem>
  }> => {
    const { dbName, listen, view } = this.props
    const path = `db/${dbName}.json`

    const db = new Loki(path, {
      persistenceMethod: 'fs',
    })

    this.dbName = dbName
    this.DB = db
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
    const fileListItem: IFileListItemFile = {
      ...values,
      dbName: this.dbName,
      content: '',
      parentIds: [], // 这里如果是全局的话就为空数组, 子文件需要加 id
      id: v1(),
    } as IFileListItemFile

    fileList.insert(fileListItem)

    return this.saveDB()
  }

  createFolderDB = async (values: Pick<IFileListItem, 'fileType' | 'fileName'>, isGlobal = false): Promise<CreateDB> => {
    console.log(this.DB)

    const fileList: Collection<IFileListItem> = this.DB.getCollection('fileList')

    // 文件夹
    const createDB = new CreateDB({ dbName: values.fileName, view: false })
    await createDB.init()

    const fileListItem: IFileListItemFolder = {
      ...values,
      dbName: isGlobal ? baseDBName : createDB.dbName,
      path: createDB.path,
      parentIds: [], // 这里如果是全局的话就为空数组, 子文件需要加 id
      id: v1(),
    } as IFileListItemFolder

    fileList.insert(fileListItem)

    return this.saveDB<CreateDB>(createDB)
  }

  saveDB = <T = any>(value?: T) => {
    return new Promise<T>((resolve, reject) => {
      console.log('saveDatabase', this.DB)
      this.DB.saveDatabase(err => {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }

  updateContent = (item: IFileListItemFile, content: string) => {
    item.content = content
    const coll = this.DB.getCollection('fileList')
    coll.update(item)
    return this.saveDB()
  }

  removeFile = item => {
    const fileList: Collection<IFileListItem> = this.DB.getCollection('fileList')
    fileList.remove(item)

    return this.saveDB()
  }

  rename = (item: IFileListItemFile, value: { fileName: string }) => {
    console.log('rename', item, this.DB, this)
    item.fileName = value.fileName
    const coll = this.DB.getCollection('fileList')
    coll.update(item)
    return this.saveDB()
  }
}

export default CreateDB
