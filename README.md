# SnippetTool

## 因安全问题 无法直接引入 less sass/scss 文件了
https://github.com/electron/electron/issues/15315


// todo list
1. 代码的提示不够智能  如 fu 就变为 function 如何去除此种情况
2. 添加更多 mode
3. 样式的修改


loading 
1. 进入时左边文件列表的加载显示
2. 左边列表点击后 右边文件 loading
3. 保存后 判断 title 是否更新->是否需要重新载入


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

存储形式
1. 目录名称存储
2. 内容存储 与目录对于的 id 的存储


存储形式 
1. 文件
自增 id $loki 
内容 content
2. 标题
对应的 文件 id=>fileId
标题 title

开始时,显示左列所有标题,格式如下
```js
[{title:'123',$loki:1,fileId:1},{title:'123',$loki:1,fileId:1}]
```
点击标题时 可通过 fileId 获取对应的文件内容 加以显示

存储时 若新建立
现存文件  得出文件 id,再存标题

若更新
也可以通过 fileId 获得 标题和文件的更新
