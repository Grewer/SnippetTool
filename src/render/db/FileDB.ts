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

  updateBaseDBByFile = (item: IFileListItem, baseDB: FileDB) => {
    // item 是某一个子文件夹下的一个文件
    // 1. 获取 item 对应的 baseDb 下的 item
    // 2. 对 item 的 children 进行更新

    return baseDB.loadChildFileById(item.rootId, this)

    // return this.saveDB()
  }

  // 应该只能   this -> main db
  loadChildFileById = (rootId: number, fileDB: FileDB): Promise<void> => {
    const baseDBItem: IFileListItemFolder = this.getColl().get(rootId)
    console.log('[loadChildFileById]', baseDBItem)
    // 加载文件夹下的子文件数据   main 里面的 item, this.getData 调用的不能是 MainDB
    baseDBItem.children = fileDB.getData()
    baseDBItem.visible = true
    baseDBItem.load = true

    const baseColl = this.getColl()

    baseColl.update(baseDBItem)

    return this.saveDB()
  }

  /**
   * 添加全局文件
   * @param values
   */
  addGlobalFolder = async values => {
    const fileDB = new FileDB({ dbName: values.fileName })
    await fileDB.init()

    const id = v1()

    const fileListItem: IFileListItemFolder = {
      ...values,
      dbName: fileDB.dbName,
      path: fileDB.path,
      load: false,
      id,
      rootId: 0,
      isGlobal: true,
      visible: false,
      children: [],
    } as IFileListItemFolder

    const fileList: Collection<IFileListItem> = this.getColl()

    fileList.insert(fileListItem)

    return this.saveDB<FileDB>(fileDB)
  }

  /**
   * 添加第二层文件夹
   * @param values
   * @param item
   * @param db
   */
  addRootFolder = async (values, item: IFileListItemFolder, db: FileDB) => {
    const id = v1()

    const fileListItem: IFileListItemFolder = {
      ...values,
      dbName: item.dbName,
      path: item.path,
      load: false,
      id,
      rootId: item.$loki,
      isGlobal: false,
      visible: false,
      children: [],
    } as IFileListItemFolder

    const fileList: Collection<IFileListItem> = db.getColl()

    fileList.insert(fileListItem)

    await db.saveDB()

    return this.loadChildFileById(item.$loki!, db)
  }

  /**
   * 添加所有子孙文件
   * @param values
   * @param item
   * @param db
   */
  addChildFolder = async (values, item: IFileListItemFolder, db: FileDB) => {
    const id = v1()

    const fileListItem: IFileListItemFolder = {
      ...values,
      dbName: item.dbName,
      path: item.path,
      load: false,
      id,
      rootId: item.rootId,
      isGlobal: false,
      visible: false,
      children: [],
    } as IFileListItemFolder

    item.children.push(fileListItem)
    // item.visible = true // TODO 无效的问题
    // item.load = true

    await db.saveDB()

    return this.loadChildFileById(item.rootId, db)
  }

  /**
   * 待修改
   * 创建文件的三种情况
   * 1. 全局文件,  需要在 main 中创建字段即可
   * 2. 第一层子文件, 需要创建文件夹数据库,更新 main 中对应 item 的数据
   * 3. 第 n 层子文件, 需要添加对应 item 的 children, 更新 main 中的数据
   */
  createFolderDB = async (
    values: Pick<IFileListItem, 'fileType' | 'fileName'>,
    isGlobal = false,
    rootId?: number,
    item?: IFileListItem
  ): Promise<FileDB> => {
    console.log(this.DB)

    const fileList: Collection<IFileListItem> = this.getColl()

    let fileDB
    if (rootId === 0) {
      // 文件夹
      fileDB = new FileDB({ dbName: values.fileName })
      await fileDB.init()
    } else {
      fileDB = this
    }

    const id = v1()

    const fileListItem: IFileListItemFolder = {
      ...values,
      dbName: fileDB.dbName,
      path: fileDB.path,
      load: false,
      id,
      rootId: isGlobal ? 0 : rootId,
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

  rename = async (item: IFileListItemFile, value: { fileName: string }) => {
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
