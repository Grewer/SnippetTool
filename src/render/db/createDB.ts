import Loki from 'lokijs'
import { v1 } from 'uuid'
import IFileType from '~/enum/FileType'
import { IFileListItem } from '~/definition/Main'

interface IProps {
  dbName: string // dbName 约等于文件名
  insertListen?: () => void
  view: boolean
}

class CreateDB {
  private props: IProps
  path = ''
  DB?: LokiConstructor
  dbName?: string

  constructor(props: IProps) {
    this.props = props
  }

  static baseDBName = 'db/Main.json'

  init = (): Promise<{
    DB: Loki
    view?: DynamicView<IFileListItem>
  }> => {
    const { dbName, insertListen, view } = this.props
    const path = `db/${dbName}.json`
    const NEWDB = new Loki(path, {
      persistenceMethod: 'fs',
    })
    this.dbName = dbName
    this.path = path
    return new Promise((resolve, reject) => {
      NEWDB.loadDatabase({}, error => {
        if (error) {
          reject(error)
        }

        let coll = NEWDB.getCollection('fileList')

        console.log('fileList', coll)

        if (!coll) {
          console.log('Collection %s does not exit. Creating ...', 'fileList')
          coll = NEWDB.addCollection('fileList', { autoupdate: true }) // 初始化字段
          // _collection.insert({ name: `user_${new Date().getTime()}` })
          NEWDB.saveDatabase()
        }

        insertListen && coll.on('insert', insertListen)

        this.DB = NEWDB
        // console.log(coll.events)
        // 可查看他的默认事件

        resolve({ DB: NEWDB, view: view ? coll.addDynamicView('fileList') : undefined })
        // console.log(_collection.data)
      })
    })
  }

  addFile = async (values: IFileListItem, DB: Loki) => {
    // TODO   这里不应该是全局的 DB, 应该是当前 DB
    console.log(DB, DB.getName())
    const fileList: Collection<IFileListItem> = DB.getCollection('fileList')
    const fileListItem: IFileListItem = {
      ...values,
    }

    // 文件夹
    if (fileListItem.fileType === IFileType.folder) {
      const createDB = new CreateDB({ dbName: values.fileName, view: false })
      await createDB.init()
      fileListItem.path = createDB.path
    } else {
      // 文件
      fileListItem.content = ''
    }

    fileListItem.parentIds = [] // 这里如果是全局的话就为空数组, 子文件需要加 id

    fileListItem.id = v1()

    fileList.insert(fileListItem)

    return new Promise((resolve, reject) => {
      this.DB?.saveDatabase(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

export default CreateDB
