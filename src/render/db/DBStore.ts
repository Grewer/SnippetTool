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

  addGlobalFile = async (values: IFileListItem) => {
    // 在根文件夹下添加文件/文件夹
    // TODO 重命名问题
    const fileDB = await this.getFileDB(baseDBName, true)
    if (values.fileType === IFileType.folder) {
      return fileDB.createFolderDB(values, true)
    }
    return fileDB.addFile(values, true)
  }

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

  addLocalFile = async (values, item: IFileListItemFolder) => {
    console.log(values, item)
    const db = await this.getFileDB(item.dbName)
    console.log(db)
    if (values.fileType === IFileType.folder) {
      await db.createFolderDB(values, false, item.$loki)
      this.loadChildFileWrap(item)
      // 保存未成功
      return
    }
    await db.addFile(values, false, item.$loki)

    this.loadChildFileWrap(item)
  }

  loadChildFileWrap = async (item: IFileListItem): Promise<void> => {
    // 这里不应该有这个函数
    // item 需要有 rootId
    // item 应该是某个文件的 item

    const currentDB = await this.getFileDB(item.dbName)

    const baseDB = await this.getFileDB(baseDBName)

    await baseDB.loadChildFile(item.rootId, currentDB)
  }

  toggleVisible = async (item: IFileListItemFolder, loading = false) => {
    const dbName = item.isGlobal ? baseDBName : item.dbName

    const baseDB = await this.getFileDB(dbName)

    return baseDB.toggleVisible(item, loading)
  }
}

const BaseDBStore = new DBStore()

console.log(BaseDBStore)

export default BaseDBStore
