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

  getFileDB = async (dbName: string, isGlobal = false): Promise<FileDB> => {
    // todo 考虑 关于 isglobal 是否有必要
    const _dbName = isGlobal ? baseDBName : dbName
    console.log('获取 createDB', _dbName)
    if (!this.cache.has(_dbName)) {
      const fileDB = new FileDB({ dbName: _dbName })
      await fileDB.init()
      this.cache.set(_dbName, fileDB)
      return fileDB
    }
    return this.cache.get(_dbName) as FileDB
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
    db.removeFile(item)

    const baseDB = await this.getFileDB(baseDBName)

    return baseDB.loadChildFileById(item.rootId, db)
  }

  updateContent = async (item: IFileListItemFile, content: string) => {
    const db = await this.getFileDB(item.dbName, item.isGlobal)
    return db.updateContent(item, content)
  }

  rename = async (item: IFileListItemFile, value) => {
    console.log(item, value)
    const db = await this.getFileDB(item.dbName, item.isGlobal)

    await db.rename(item, value)

    if (item.isGlobal) {
      return Promise.resolve()
    }

    return this.loadChildFileWrap(item)
  }

  loadChildFileWrap = async (item: IFileListItem): Promise<void> => {
    // 这里不应该有这个函数
    // item 需要有 rootId
    // item 应该是某个文件的 item
    console.log('loadChildFileWrap')
    const baseDB = await this.getFileDB(baseDBName)
    const currentDB = await this.getFileDB(item.dbName)

    return baseDB.loadChildFileById(item.isGlobal ? item.$loki! : item.rootId, currentDB)
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
    const baseDB = await this.getFileDB(baseDBName)
    if (item.isGlobal) {
      return baseDB.toggleVisible(item, loading)
    }
    const db = await this.getFileDB(item.dbName)
    await db.toggleVisible(item, loading) // TODO 修改
    // 还是有问题
    return baseDB.loadChildFileById(item.rootId, db)
  }

  addFolder = async (values, item?: IFileListItemFolder) => {
    console.log('[add Folder]', values, item)
    const baseDB = await this.getFileDB(baseDBName)

    if (!item) {
      // 全局文件夹
      return baseDB.addGlobalFolder(values)
    }

    const db = await this.getFileDB(item.dbName)

    if (item.isGlobal) {
      return baseDB.addRootFolder(values, item, db)
    }
    // 考虑这 2 层是否能够合并  现在不合并 逻辑更加清晰
    return baseDB.addChildFolder(values, item, db)
  }

  addFile = async (values, item?: IFileListItemFile) => {
    console.log('[add File]', values, item)
    const baseDB = await this.getFileDB(baseDBName)

    if (!item) {
      // 全局文件
      return baseDB.addGlobalFile(values)
    }
    console.log('添加子文件')
    const db = await this.getFileDB(item.dbName)
    baseDB.addChildFile(values, item, db)
  }
}

const BaseDBStore = new DBStore()

console.log(BaseDBStore)

export default BaseDBStore
