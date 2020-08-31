import { v1 } from 'uuid'
import Loki from 'lokijs'
import { IFileListItem, IFileListItemFile, IFileListItemFolder } from '~/definition/Main'

/**
 * 封装事件操作
 */

//  考虑 id 的作用  是否需要  还是使用 $loki 来作为关键值

export interface IFileDB {
  dbName: string // dbName 约等于文件名
  listen?: {
    insert?: (event) => void
    update?: (event) => void
    delete?: (event) => void
  }
}

// pre-insert: []
// pre-update: []
// close: []
// flushbuffer: []
// error: []
// warning: [ƒ]

class FileDB {
  private props: IFileDB

  // 初始就会创建 所以默认存在
  DB!: Loki
  dbName!: string
  path = ''

  constructor(props: IFileDB) {
    this.props = props
  }

  getColl = (fileListName = 'fileList') => {
    return this.DB.getCollection(fileListName)
  }

  getView = () => {
    const coll = this.getColl()
    const dv = coll.getDynamicView('fileList')
    if (!dv) {
      return coll.addDynamicView('fileList')
    }
    return dv
  }

  getData = () => {
    const coll = this.getColl()
    return coll.data
  }

  init = async () => {
    const { dbName, listen } = this.props
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
          coll = db.addCollection('fileList', {
            unique: ['id'],
            indices: 'id',
            autoupdate: true,
          }) // 初始化字段
          db.saveDatabase(err => {
            err && reject(error)
          })
        }

        if (listen) {
          Object.keys(listen).forEach(listenName => {
            coll.on(listenName, listen[listenName])
          })
        }

        resolve()
      })
    })
  }

  addFile = async (values: Pick<IFileListItem, 'fileType' | 'fileName'>, isGlobal = false, rootId?: number) => {
    console.log(this.DB)

    const fileList: Collection<IFileListItem> = this.getColl()
    const id = v1()
    const fileListItem: IFileListItemFile = {
      ...values,
      dbName: this.dbName,
      content: '',
      id,
      isGlobal,
      rootId: isGlobal ? 0 : rootId,
    } as IFileListItemFile

    fileList.insert(fileListItem)

    return this.saveDB()
  }

  updateBaseDBByFile = (item, baseDB: FileDB) => {
    // item 是某一个子文件夹下的一个文件
    // 1. 获取 item 对应的 baseDb 下的 item
    // 2. 对 item 的 children 进行更新
    console.log(item, baseDB)
    // baseDB.DB // 根据 dbName 获取 baseDB 中的文件夹 item 需要一个方法
  }

  loadChildFile = (item: IFileListItemFolder, baseDB: FileDB) => {
    // 加载文件夹下的子文件数据
    item.children = this.getData()
    item.visible = true
    item.load = true

    const baseColl = baseDB.getColl()

    baseColl.update(item)

    return this.saveDB()
  }

  createFolderDB = async (values: Pick<IFileListItem, 'fileType' | 'fileName'>, isGlobal = false, rootId?: number): Promise<FileDB> => {
    console.log(this.DB)

    const fileList: Collection<IFileListItem> = this.getColl()

    // 文件夹
    const fileDB = new FileDB({ dbName: values.fileName })
    await fileDB.init()

    const id = v1()

    const fileListItem: IFileListItemFolder = {
      ...values,
      dbName: fileDB.dbName,
      path: fileDB.path,
      load: false,
      id,
      rootId: isGlobal ? id : rootId,
      isGlobal,
      visible: false,
      children: [],
    } as IFileListItemFolder

    fileList.insert(fileListItem)

    return this.saveDB<FileDB>(fileDB)
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
    const coll = this.getColl()
    coll.update(item)
    return this.saveDB()
  }

  removeFile = item => {
    const fileList: Collection<IFileListItem> = this.getColl()
    fileList.remove(item)

    return this.saveDB()
  }

  rename = (item: IFileListItemFile, value: { fileName: string }) => {
    // console.log('rename', item, this.DB, this)
    item.fileName = value.fileName
    const coll = this.getColl()
    coll.update(item)
    return this.saveDB()
  }

  toggleVisible = async (item, loading) => {
    item.visible = loading

    const coll = this.getColl()

    coll.update(item)

    await this.saveDB()
  }
}

export default FileDB
