import { ipcMain } from 'electron'
import jetpack from 'fs-jetpack'
import Loki from 'lokijs'

const Events = [
  {
    name: 'app-init',
    type: 'handleOnce',
    listener: () => {
      return new Promise((resolve, reject) => {
        jetpack.dir(`db`)
        const db = new Loki('db/Main.json', {
          persistenceMethod: 'fs',
        })
        const users = db.addCollection('title', { indices: ['id'] })
        const newUser = {
          name: `user_${new Date().getTime()}`,
        }
        users.insert(newUser as any)

        db.saveDatabase()
        resolve()
        // console.log(db)
      })
    },
  },
]

export default Events

export const registryEvent = (events: typeof Events) => {
  let i = events.length
  while (i--) {
    const { name, type = 'on', listener } = events[i]
    ipcMain[type](name, listener)
  }
}
