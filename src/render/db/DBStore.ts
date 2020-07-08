import jetpack from 'fs-jetpack'
import CreateDB from '~/db/createDB'
import { IFileListItem } from '~/definition/Main'
import LokiDB from '~/db/LokiDB'

const configDBName = 'db/Main.json'

class DBStore {
  cache = {} as any // TODO 类型添加
  private dynamicData?: DynamicView<IFileListItem>
  private baseCreateDB?: CreateDB

  appInit = async listen => {
    jetpack.dir(`db`)

    const createDB = new CreateDB({ dbName: 'Main', insertListen: listen, view: true })
    const { DB, view } = await createDB.init()

    this.cache[configDBName] = DB
    this.baseCreateDB = createDB
    this.dynamicData = view
    return Promise.resolve(view)
  }

  getBaseDB = (): LokiDB => {
    return this.cache[configDBName]
  }

  getFileView = () => {
    return this.dynamicData
  }

  addFile = (values: IFileListItem) => {
    // 在跟文件夹下添加文件/文件夹
    return this.baseCreateDB?.addFile(values, this.getBaseDB())
    // 这是全局的添加  需要另一个方法 将文件夹和子文件夹挂钩
  }
}

const BaseDBStore = new DBStore()

export default BaseDBStore
