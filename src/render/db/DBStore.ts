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

  getCreateDB = async (dbName: string, isGlobal = false): Promise<FileDB> => {
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
    const fileDB = await this.getCreateDB(baseDBName, true)
    if (values.fileType === IFileType.folder) {
      return fileDB.createFolderDB(values, true)
    }
    return fileDB.addFile(values, true)
  }

  deleteFile = async (item: IFileListItemFile) => {
    console.log(item)
    // todo 删除文件夹的时候需要删除本地文件
    const db = await this.getCreateDB(item.dbName, item.isGlobal)
    if (item.isGlobal) {
      // 只删除 global 文件
      return db.removeFile(item)
    }

    // 删除文件夹下的文件/文件夹
    // 需要删除当前文件夹数据库的数据, 并且更新数据到 baseDB
    db.removeFile(item)

    const baseDB = await this.getCreateDB(baseDBName)

    await db.updateBaseDBByFile(item, baseDB)
  }

  updateContent = async (item: IFileListItemFile, content: string) => {
    const db = await this.getCreateDB(item.dbName, item.isGlobal)
    return db.updateContent(item, content)
  }

  rename = async (item: IFileListItemFile, value) => {
    const db = await this.getCreateDB(item.dbName, item.isGlobal)
    return db.rename(item, value)
  }

  addLocalFile = async (values, item) => {
    console.log(values, item)
    const db = await this.getCreateDB(item.dbName)
    console.log(db)
    if (values.fileType === IFileType.folder) {
      await db.createFolderDB(values, false)
      this.loadChildFile(item)
      // 保存未成功
      return
    }
    await db.addFile(values, false)

    this.loadChildFile(item)
  }

  loadChildFile = async item => {
    // item 必须是文件夹?
    // 先假设文件目录只有一层
    const currentDB = await this.getCreateDB(item.dbName)

    const baseDB = await this.getCreateDB(baseDBName)

    await currentDB.loadChildFile(item, baseDB)
  }

  toggleVisible = async (item: IFileListItemFolder, loading = false) => {
    const dbName = item.isGlobal ? baseDBName : item.dbName

    const baseDB = await this.getCreateDB(dbName)

    return baseDB.toggleVisible(item, loading)
  }
}

const BaseDBStore = new DBStore()

console.log(BaseDBStore)

export default BaseDBStore
