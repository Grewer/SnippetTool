# SnippetTool

## 因安全问题 无法直接引入 less sass/scss 文件了
https://github.com/electron/electron/issues/15315


// todo list
1. 代码的提示不够智能  如 fu 就变为 function 如何去除此种情况
2. 添加更多 mode
3. 样式的修改

```js
var loki = require('lokijs'),
    db = new loki('test.json');

function loadCollection(colName, callback) {
    db.loadDatabase({}, function () {
        var _collection = db.getCollection(colName);

        if (!_collection) {
            console.log("Collection %s does not exit. Creating ...", colName);
            _collection = db.addCollection('users');
        }

        callback(_collection);
    });
}

loadCollection('users', function (users) {
    //show the users
    console.log(users.data);

    var newUser = {
        name: 'user_' + (new Date()).getTime()
    };

    //add one
    users.insert(newUser);

    console.log("Added a new user => ", newUser);

    //save 
    db.saveDatabase();
});
```
