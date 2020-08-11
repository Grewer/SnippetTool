import jetpack from 'fs-jetpack'
import CreateDB, { ICreateDB } from '~/db/createDB'
import { IFileListItem, IFileListItemFile } from '~/definition/Main'
import { baseDBName } from '~/config'
import IFileType from '~/enum/FileType'

class DBStore {
  cache = new Map<string, CreateDB>()

  private dynamicData?: DynamicView<IFileListItem>

  appInit = async (listen: ICreateDB['listen']) => {
    jetpack.dir(`db`)

    const createDB = new CreateDB({ dbName: baseDBName, listen, view: true })
    const { view } = await createDB.init()
    console.log('createDB', createDB)

    this.cache.set(baseDBName, createDB)
    this.dynamicData = view
    return Promise.resolve(view)
  }

  getCreateDB = async (dbName: string, isGlobal = false): Promise<CreateDB> => {
    const _dbName = isGlobal ? baseDBName : dbName
    console.log('获取 createDB', _dbName)
    if (!this.cache.has(_dbName)) {
      const createDB = new CreateDB({ dbName: _dbName, view: false })
      await createDB.init()
      this.cache.set(_dbName, createDB)
      return createDB
    }
    return this.cache.get(_dbName) as CreateDB
  }

  getFileView = () => {
    return this.dynamicData
  }

  addGlobalFile = async (values: IFileListItem) => {
    // 在根文件夹下添加文件/文件夹
    // TODO 重命名问题
    const createDB = await this.getCreateDB(baseDBName, true)
    if (values.fileType === IFileType.folder) {
      return createDB.createFolderDB(values, true)
    }
    return createDB.addFile(values, true)
  }

  deleteFile = async (item: IFileListItemFile) => {
    const db = await this.getCreateDB(item.dbName, item.isGlobal)
    return db.removeFile(item)
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
  }
}

const BaseDBStore = new DBStore()

console.log(BaseDBStore)

export default BaseDBStore
