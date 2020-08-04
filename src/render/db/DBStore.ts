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

  // 删除 global 属性

  addGlobalFile = (values: IFileListItem) => {
    // 在根文件夹下添加文件/文件夹
    return this.getCreateDB(baseDBName).addFile(values)
    // 这是全局的添加  需要另一个方法 将文件夹和子文件夹挂钩
  }

  deleteGlobalFile = (item: IFileListItemFile) => {
    this.getCreateDB(item.dbName).removeFile(item)
  }

  updateContent = (item, content) => {
    // item.content = content
    // const db = this.getBaseDB(item.dbName)
    // console.log('run updateContent')
    // // users.update(stan);
    // db.saveDatabase()
  }

  rename = (item: IFileListItemFile, value) => {
    console.log(item, value)
    this.getCreateDB(item.dbName).rename(item, value)
  }
}

const BaseDBStore = new DBStore()

export default BaseDBStore
