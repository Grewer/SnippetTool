import Loki from 'lokijs'
import { ICreateDB } from '~/db/createDB'
import { IFileListItem } from '~/definition/Main'

/**
 * 封装 Loki 操作
 */
class LokiDB {
  coreDB: LokiConstructor

  constructor(filename: string, options?: Partial<LokiConstructorOptions> & Partial<LokiConfigOptions> & Partial<ThrottledSaveDrainOptions>) {
    this.coreDB = new Loki(filename, {
      persistenceMethod: 'fs',
      ...options,
    })
  }

  create = (
    insertListen: ICreateDB['insertListen'],
    view: ICreateDB['view']
  ): Promise<{
    DB: Loki
    view?: DynamicView<IFileListItem>
  }> => {
    return new Promise((resolve, reject) => {
      this.coreDB.loadDatabase({}, error => {
        if (error) {
          reject(error)
        }

        let coll = this.coreDB.getCollection('fileList')

        console.log('fileList', coll)

        if (!coll) {
          console.log('Collection %s does not exit. Creating ...', 'fileList')
          coll = this.coreDB.addCollection('fileList', { autoupdate: true }) // 初始化字段
          this.coreDB.saveDatabase(err => {
            err && reject(error)
          })
        }

        insertListen && coll.on('insert', insertListen)

        resolve({ DB: this.coreDB, view: view ? coll.addDynamicView('fileList') : undefined })
      })
    })
  }

  getCollection = <F extends object = any>(colName: string): Collection<F> => {
    return this.coreDB.getCollection(colName)
  }

  saveDatabase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log('saveDatabase', this.coreDB)
      this.coreDB.saveDatabase(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

export default LokiDB
