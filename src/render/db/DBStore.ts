import jetpack from 'fs-jetpack'
import FileDB, { IFileDB } from '~/db/FileDB'
import { IFileListItem, IFileListItemFile, IFileListItemFolder } from '~/definition/Main'
import { baseDBName } from '~/config'
import IFileType from '~/enum/FileType'

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
  //
  // addGlobalFile = async (values: IFileListItem) => {
  //   // 在根文件夹下添加文件/文件夹
  //   // TODO 重命名问题
  //   const fileDB = await this.getFileDB(baseDBName, true)
  //   if (values.fileType === IFileType.folder) {
  //     return fileDB.createFolderDB(values, true)
  //   }
  //   return fileDB.addFile(values, true)
  // }

  deleteFile = async (item: IFileListItemFile) => {
    console.log(item)
    // todo 删除文件夹的时候需要删除本地文件
    const db = await this.getFileDB(item.dbName, item.isGlobal)
    if (item.isGlobal) {
      // 只删除 global 文件
      return db.removeFile(item)
    }

    // 删除文件夹下的文件/文件夹
    // 需要删除当前文件夹数据库的数据, 并且更新数据到 baseDB
    db.removeFile(item)

    const baseDB = await this.getFileDB(baseDBName)

    await db.updateBaseDBByFile(item, baseDB)

    return baseDB.saveDB()
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

  // addLocalFile = async (values, item: IFileListItemFolder) => {
  //   // 非全局文件  item => 不一定为 global
  //   console.log(values, item)
  //   const db = await this.getFileDB(item.dbName)
  //   console.log(db)
  //   if (values.fileType === IFileType.folder) {
  //     await db.createFolderDB(values, false, item.$loki, item)
  //     this.loadChildFileWrap(item)
  //     // 保存未成功
  //     return
  //   }
  //   await db.addFile(values, false, item.$loki)
  //
  //   this.loadChildFileWrap(item)
  // }

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
    await db.toggleVisible(item, loading)

    return baseDB.loadChildFileById(item.rootId, db)
  }

  addFolder = async (values, item?: IFileListItemFolder) => {
    console.log('[add Folder]', values, item)
    const baseDB = await this.getFileDB(baseDBName)

    if (!item) {
      // 全局文件
      return baseDB.addGlobalFolder(values)
    }

    const db = await this.getFileDB(item.dbName)

    if (item.isGlobal) {
      return baseDB.addRootFolder(values, item, db)
    }
    // 考虑这 2 层是否能够合并  现在不合并 逻辑更加清晰
    return baseDB.addChildFolder(values, item, db)
  }
}

const BaseDBStore = new DBStore()

console.log(BaseDBStore)

export default BaseDBStore
