import jetpack from 'fs-jetpack'
import Loki from 'lokijs'
import CreateDB from '~/db/createDB'
import { IFileListItem } from '~/definition/Main'

const configDBName = 'db/Main.json'

class DBStore {
  cache = {} as any
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

  getBaseDB = (): Loki => {
    return this.cache[configDBName]
  }

  getFileView = () => {
    return this.dynamicData
  }

  addFile = (values: IFileListItem) => {
    // 在跟文件夹下添加文件/文件夹
    return this.baseCreateDB?.addFile(values)
    // TODO 添加完文件夹后的操作
  }
}

const BaseDBStore = new DBStore()

export default BaseDBStore
