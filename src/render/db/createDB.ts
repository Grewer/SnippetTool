import { v1 } from 'uuid'
import IFileType from '~/enum/FileType'
import { IFileListItem } from '~/definition/Main'
import LokiDB from '~/db/LokiDB'

/**
 * 封装事件操作
 */

export interface ICreateDB {
  dbName: string // dbName 约等于文件名
  insertListen?: () => void
  view: boolean
}

class CreateDB {
  private props: ICreateDB
  path = ''
  DB?: LokiDB
  dbName?: string

  constructor(props: ICreateDB) {
    this.props = props
  }

  static baseDBName = 'db/Main.json'

  init = async (): Promise<{
    DB: Loki
    view?: DynamicView<IFileListItem>
  }> => {
    const { dbName, insertListen, view } = this.props
    const path = `db/${dbName}.json`

    const db = new LokiDB(path)

    const result = await db.create(insertListen, view)

    this.DB = db
    this.dbName = dbName
    this.path = path

    return result
  }

  addFile = async (values: Pick<IFileListItem, 'fileType' | 'fileName'>, DB: Loki) => {
    console.log(DB)

    const fileList: Collection<IFileListItem> = DB.getCollection('fileList')
    const fileListItem: IFileListItem = {
      ...values,
    } as IFileListItem

    // 文件夹
    if (fileListItem.fileType === IFileType.folder) {
      const createDB = new CreateDB({ dbName: values.fileName, view: false })
      await createDB.init()
      fileListItem.path = createDB.path
    } else {
      // 文件
      fileListItem.content = ''
      fileListItem.dbName = DB.filename
    }

    fileListItem.parentIds = [] // 这里如果是全局的话就为空数组, 子文件需要加 id

    fileListItem.id = v1()

    fileList.insert(fileListItem)

    await this.DB?.saveDatabase()
  }
}

export default CreateDB
