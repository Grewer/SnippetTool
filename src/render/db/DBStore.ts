import jetpack, { removeAsync } from 'fs-jetpack'
import FileDB, { IFileDB } from '~/db/FileDB'
import { IFileListItem, IFileListItemFile, IFileListItemFolder } from '~/definition/Main'
import { baseDBName } from '~/config'
import IFileType from '~/enum/FileType'

// 注意!!
// 因为 item 可能不在当前 DB 中 所以直接 操作 item 会出问题

class DBStore {
  cache = new Map<string, FileDB>()

  private dynamicData?: DynamicView<IFileListItem>

  appInit = async (listen: IFileDB['listen']) => {
    jetpack.dir(`db`)

    const fileDB = new FileDB({ dbName: baseDBName, listen })
    await fileDB.init()
    const view = fileDB.getView()
    console.log('fileDB', fileDB)
    this.cache.set(baseDBName, fileDB)
    this.dynamicData = view
    return Promise.resolve(view)
  }

  get BaseDB() {
    return this.cache.get(baseDBName)!
  }

  getFileDB = async (dbName: string, isGlobal = false): Promise<FileDB> => {
    if (isGlobal) {
      return this.BaseDB
    }
    console.log('获取 createDB', dbName)
    if (!this.cache.has(dbName)) {
      const fileDB = new FileDB({ dbName })
      await fileDB.init()
      this.cache.set(dbName, fileDB)
      return fileDB
    }
    return Promise.resolve(this.cache.get(dbName)!)
  }

  getFileView = () => {
    return this.dynamicData
  }

  deleteFile = async (item: IFileListItem) => {
    console.log(item)
    const db = await this.getFileDB(item.dbName, item.isGlobal)
    if (item.isGlobal) {
      // 只删除 global 文件
      if (item.fileType === IFileType.folder) {
        await removeAsync(`db/${item.dbName}.json`)
      }
      return db.removeGlobalFile(item)
    }
    // 删除文件夹下的文件/文件夹
    // 需要删除当前文件夹数据库的数据, 并且更新数据到 baseDB
    await db.removeFile(item)

    return this.BaseDB.loadChildFileById(item.rootId || item.$loki!, db)
  }

  updateContent = async (item: IFileListItemFile, content: string) => {
    const db = await this.getFileDB(item.dbName, item.isGlobal)
    console.log('db', db)
    await db.updateContent(item, content)
    if (item.isGlobal) {
      return Promise.resolve()
    }
    return this.BaseDB.loadChildFileById(item.rootId, db)
  }

  rename = async (item: IFileListItemFile, value) => {
    console.log(item, value)
    const db = await this.getFileDB(item.dbName, item.isGlobal)

    await db.rename(item, value)

    if (item.isGlobal) {
      return Promise.resolve()
    }
    console.log('loadChildFileWrap')

    return this.BaseDB.loadChildFileById(item.isGlobal ? item.$loki! : item.rootId, db)
  }

  /**
   * 切换显示
   * @param item
   * @param loading
   * 如果是全局文件 只需要在全局的 db 里面操作
   * 如果不是全局的文件, 需要的是更新局部 ab 里的 visible 字段 还有 更新 main 数据库
   */
  toggleVisible = async (item: IFileListItemFolder, loading = false) => {
    console.log('toggle', item)
    const db = await this.getFileDB(item.dbName, item.isGlobal)
    await db.toggleVisible(item, loading)
    if (item.isGlobal) {
      return
    }
    return this.BaseDB.loadChildFileById(item.rootId, db)
  }

  addFolder = async (values, item?: IFileListItemFolder) => {
    console.log('[add Folder]', values, item)
    if (!item) {
      // 全局文件夹
      return this.BaseDB.addGlobalFolder(values)
    }

    const db = await this.getFileDB(item.dbName)

    if (item.isGlobal) {
      return this.BaseDB.addRootFolder(values, item, db)
    }
    // 考虑这 2 层是否能够合并  现在不合并 逻辑更加清晰
    return this.BaseDB.addChildFolder(values, item, db)
  }

  addFile = async (values, item?: IFileListItemFile) => {
    console.log('[add File]', values, item)

    if (!item) {
      // 全局文件
      return this.BaseDB.addGlobalFile(values)
    }
    console.log('添加子文件')
    const db = await this.getFileDB(item.dbName)
    await this.BaseDB.addChildFile(values, item, db)
  }

  /**
   * 获取文件系统的树形结构
   */
  getDBTree = async () => {
    return Promise.resolve(this.dynamicData)
  }
}

const BaseDBStore = new DBStore()

console.log(BaseDBStore)

export default BaseDBStore
