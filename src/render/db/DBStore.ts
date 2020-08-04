import jetpack from 'fs-jetpack'
import CreateDB, { ICreateDB } from '~/db/createDB'
import { IFileListItem, IFileListItemFile } from '~/definition/Main'
import { baseDBName } from '~/config'

class DBStore {
  cache = {} as { [key: string]: CreateDB }
  private dynamicData?: DynamicView<IFileListItem>

  appInit = async (listen: ICreateDB['listen']) => {
    jetpack.dir(`db`)

    const createDB = new CreateDB({ dbName: 'Main', listen, view: true })
    const { view } = await createDB.init()
    console.log('createDB', createDB)

    this.cache[baseDBName] = createDB
    this.dynamicData = view
    return Promise.resolve(view)
  }

  getCreateDB = (dbName: string): CreateDB => {
    return this.cache[dbName]
  }

  getFileView = () => {
    return this.dynamicData
  }

  addFile = (values: IFileListItem) => {
    // 在根文件夹下添加文件/文件夹 todo 修改 dbname 的获取
    return this.getCreateDB(baseDBName).addFile(values)
  }

  deleteFile = (item: IFileListItemFile) => {
    this.getCreateDB(item.dbName).removeFile(item)
  }

  updateContent = (item: IFileListItemFile, content: string) => {
    this.getCreateDB(item.dbName).updateContent(item, content)
  }

  rename = (item: IFileListItemFile, value) => {
    this.getCreateDB(item.dbName).rename(item, value)
  }
}

const BaseDBStore = new DBStore()

export default BaseDBStore
