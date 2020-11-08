import { v1 } from 'uuid'
import Loki from 'lokijs'
import { propEq } from '@grewer/tools'
import { IFileListItem, IFileListItemFile, IFileListItemFolder } from '~/definition/Main'
import IFileType from '~/enum/FileType'
import { baseDBName } from '~/config'

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

  getColl = <T extends object = any>(fileListName = 'fileList') => {
    return this.DB.getCollection<T>(fileListName)
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
    // 如果 this.dbname 是 main 就直接返回 data
    if (this.dbName === baseDBName) {
      return this.getColl<IFileListItem>()
        .chain()
        .data()
    }
    const originData = this.getColl<IFileListItemFolder>()
      .chain()
      .sort((obj1, obj2) => {
        if (obj1.routes.length > obj2.routes.length) return 1
        if (obj1.routes.length < obj2.routes.length) return -1
        return -1
      })
      .map(
        item => {
          item.children = []
          return item
        },
        {
          removeMeta: true,
        }
      )
      .data({
        forceClones: true,
      })

    console.log('originData', originData)
    let { length } = originData
    let data: IFileListItemFolder[] = []
    while (length--) {
      const item = originData[length]
      if (!item.routes.length) {
        if (length === originData.length - 1) {
          data = originData
          break
        }
        data.push(item)
        continue
      }
      const id = item.routes[item.routes.length - 1]
      const obj = originData.find(propEq('id', id))
      if (obj) {
        // 子文件夹
        obj.children.push(item)
      } else {
        // 文件
        data.push(item)
      }
    }
    console.log(data)
    return data
  }

  init = async () => {
    const { dbName, listen = {} } = this.props
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

  // 应该只能   this -> main db
  loadChildFileById = (rootId: number, fileDB: FileDB): Promise<void> => {
    const baseDBItem = this.getColl<IFileListItemFolder>().get(rootId)
    console.log('[loadChildFileById]', baseDBItem, rootId)
    // 加载文件夹下的子文件数据   main 里面的 item, this.getData 调用的不能是 MainDB
    baseDBItem.children = fileDB.getData()
    baseDBItem.visible = true

    this.itemUpdate(baseDBItem)
    return this.saveDB()
  }

  /**
   * 添加全局文件
   * @param values
   */
  addGlobalFolder = async (values: { fileName: string; fileType: IFileType.folder }) => {
    const fileDB = new FileDB({ dbName: values.fileName })
    await fileDB.init()

    const id = v1()

    const fileListItem: IFileListItemFolder = {
      ...values,
      dbName: fileDB.dbName,
      path: fileDB.path,
      id,
      rootId: 0,
      isGlobal: true,
      visible: false,
      children: [],
      routes: [],
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
      id,
      rootId: item.$loki,
      isGlobal: false,
      visible: false,
      children: [],
      routes: [],
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
   * 与 root 不一样的地方: 1. routes 2. rootId
   */
  addChildFolder = async (values, item: IFileListItemFolder, db: FileDB) => {
    const id = v1()
    // 在获取数据时 对 paths 排序,再进行插入 children
    const fileListItem: IFileListItemFolder = {
      ...values,
      dbName: item.dbName,
      path: item.path,
      id,
      rootId: item.rootId,
      isGlobal: false,
      visible: false,
      children: [],
      routes: item.routes.concat(item.id),
    } as IFileListItemFolder

    const fileList: Collection<IFileListItem> = db.getColl()

    fileList.insert(fileListItem)

    await db.saveDB()

    return this.loadChildFileById(item.rootId, db)
  }

  addGlobalFile = values => {
    const fileList = this.getColl<IFileListItem>()
    const id = v1()
    const fileListItem: IFileListItemFile = {
      ...values,
      dbName: this.dbName,
      content: '',
      id,
      isGlobal: true,
      rootId: 0,
    } as IFileListItemFile

    fileList.insert(fileListItem)

    return this.saveDB()
  }

  addChildFile = async (values, item, db) => {
    const key = item.rootId || item.$loki

    const id = v1()
    const fileListItem: IFileListItemFile = {
      ...values,
      dbName: item.dbName,
      content: '',
      id,
      isGlobal: false,
      rootId: key,
      routes: item.routes.concat(item.id),
    } as IFileListItemFile

    const fileList: Collection<IFileListItem> = db.getColl()

    fileList.insert(fileListItem)

    await db.saveDB()
    console.log(key)
    return this.loadChildFileById(key, db)
  }

  updateContent = async (item: IFileListItemFile, content: string) => {
    if (item.isGlobal) {
      this.itemUpdate(item)
      return this.saveDB()
    }
    const obj = await this.findAndUpdate<IFileListItemFile>(item.id)
    obj.content = content

    return this.saveDB()
  }

  removeFile = item => {
    const fileList: Collection<IFileListItem> = this.getColl()
    fileList.findAndRemove({ id: { $eq: item.id } })
    return this.saveDB()
  }

  removeGlobalFile = item => {
    const fileList: Collection<IFileListItem> = this.getColl()
    fileList.remove(item)
    return this.saveDB()
  }

  rename = async (item: IFileListItemFile, value: { fileName: string }) => {
    // console.log('rename', item, this.DB, this)

    if (item.isGlobal) {
      item.fileName = value.fileName
      this.itemUpdate(item)
      return this.saveDB()
    }

    const obj = await this.findAndUpdate(item.id)
    obj.fileName = value.fileName
    return this.saveDB()
  }

  toggleVisible = async (item, loading) => {
    if (item.isGlobal) {
      item.visible = loading
      this.itemUpdate(item)
      return this.saveDB()
    }
    const obj = await this.findAndUpdate<IFileListItemFolder>(item.id)
    obj.visible = loading
    return this.saveDB()
  }

  /**
   * 封装 save database 函数
   * @param value
   */
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

  /**
   * 封装 item update 重复代码
   * @param item
   */
  itemUpdate = (item: IFileListItem) => {
    const coll = this.getColl()
    coll.update(item)
  }

  /**
   * 封装 find and update 函数
   * @param id
   */
  findAndUpdate = <T = IFileListItem>(id: string): Promise<T> => {
    return new Promise(resolve => {
      this.getColl().findAndUpdate({ id: { $eq: id } }, obj => {
        resolve(obj)
      })
    })
  }
}

export default FileDB
