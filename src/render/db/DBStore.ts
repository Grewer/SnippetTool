import jetpack from 'fs-jetpack'
import CreateDB from '~/db/createDB'
import { IFileListItem } from '~/definition/Main'
import { baseDBName } from '~/config'

class DBStore {
  cache = {} as { [key: string]: Loki }
  private dynamicData?: DynamicView<IFileListItem>
  private baseCreateDB?: CreateDB

  appInit = async listen => {
    jetpack.dir(`db`)

    const createDB = new CreateDB({ dbName: 'Main', insertListen: listen, view: true })
    const { DB, view } = await createDB.init()
    console.log('createDB', createDB)

    this.cache[baseDBName] = DB
    this.baseCreateDB = createDB
    this.dynamicData = view
    return Promise.resolve(view)
  }

  getBaseDB = (dbName: string): Loki => {
    return this.cache[dbName]
  }

  getFileView = () => {
    return this.dynamicData
  }

  addGlobalFile = (values: IFileListItem) => {
    // 在根文件夹下添加文件/文件夹
    return this.baseCreateDB?.addFile(values, this.getBaseDB(baseDBName))
    // 这是全局的添加  需要另一个方法 将文件夹和子文件夹挂钩
  }

  updateContent = (item, content) => {
    item.content = content
    const db = this.getBaseDB(item.dbName)
    console.log('run updateContent')
    db.saveDatabase()
  }
  // TODO  数据库操作过于冗余,待解决
}

const BaseDBStore = new DBStore()

export default BaseDBStore
