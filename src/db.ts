import {app} from "electron";
import * as loki from 'lokijs'

const dbPath = app.getPath('userData') + '/db.json'
console.log(dbPath)

const db = new loki(dbPath);
// console.log('init db', db)

export function loadCollection(colName, callback) {
  db.loadDatabase({}, function () {
    var _collection = db.getCollection(colName);

    if (!_collection) {
      console.log("Collection %s does not exit. Creating ...", colName);
      _collection = db.addCollection(colName);
    }

    callback(_collection, db);
  });
}

//
// export function save() {
//   db.saveDatabase();
// }
