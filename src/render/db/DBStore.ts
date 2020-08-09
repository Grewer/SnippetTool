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

  getCreateDB = async (dbName: string): Promise<CreateDB> => {
    if (!this.cache.has(dbName)) {
      // return new CreateDB()
      console.log('需要创建')
      const createDB = new CreateDB({ dbName, view: false })
      await createDB.init()
      this.cache.set(dbName, createDB)
      return createDB
    }
    return this.cache.get(dbName) as CreateDB
  }

  getFileView = () => {
    return this.dynamicData
  }

  addGlobalFile = async (values: IFileListItem) => {
    // 在根文件夹下添加文件/文件夹
    // TODO 重命名问题
    const createDB = await this.getCreateDB(baseDBName)
    if (values.fileType === IFileType.folder) {
      const db = await createDB.createFolderDB(values, true)
      console.log(createDB, this.cache, db)
      return Promise.resolve()
    }
    return createDB.addFile(values)
  }

  deleteFile = async (item: IFileListItemFile) => {
    const db = await this.getCreateDB(item.dbName)
    return db.removeFile(item)
  }

  updateContent = async (item: IFileListItemFile, content: string) => {
    const db = await this.getCreateDB(item.dbName)
    return db.updateContent(item, content)
  }

  rename = async (item: IFileListItemFile, value) => {
    const db = await this.getCreateDB(item.dbName)
    console.log(this.cache, item, db)
    return db.rename(item, value)
  }
}

const BaseDBStore = new DBStore()

console.log(BaseDBStore)

export default BaseDBStore
