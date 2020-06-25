import jetpack from 'fs-jetpack'
import Loki from 'lokijs'
import IFileType from '~/enum/FileType'
import CreateDB from '~/db/createDB'
import { IFileListItem } from '~/defined/Main'

const configDBName = 'db/Main.json'

export interface IFile {
  fileType: IFileType
  fileName: string
}

class DBStore {
  cache = {} as any
  private dynamicData?: DynamicView<IFileListItem>
  private createDB?: CreateDB

  appInit = async listen => {
    jetpack.dir(`db`)

    const createDB = new CreateDB({ dbName: 'Main', insertListen: listen, view: true })
    const { DB, view } = await createDB.init()

    this.cache[configDBName] = DB
    this.createDB = createDB
    this.dynamicData = view
    return Promise.resolve(view)
  }

  getBaseDB = (): Loki => {
    return this.cache[configDBName]
  }

  getFileView = () => {
    return this.dynamicData
  }

  addFile = (values: IFile) => {
    // todo
    return this.createDB?.addFile(values)
  }
}

const BaseDBStore = new DBStore()

export default BaseDBStore
