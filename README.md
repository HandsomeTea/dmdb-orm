
### 连接数据库
```typescript
import { DMServer } from 'dmdb-orm';

const service = new DMServer({
    connectString: 'dm://SYSDBA:SYSDBA@localhost:5236'
});

service.connect();
```
- `DMServer constructor(dmdb.PoolAttributes[, DmServerOption])`
  - `dmdb.PoolAttributes`，达梦官方nodejs驱动包连接数据库的参数，详见[达梦官方文档](https://eco.dameng.com/document/dm/zh-cn/pm/nodejs-rogramming-guide.html#10.3.1.3%E5%87%BD%E6%95%B0%E5%8E%9F%E5%9E%8B)
  - `[DmServerOption]`，可选的object
    - `modelName`：string，达梦数据库的表所在的模式，数据库表的model也有该选项，会覆盖这里的设置
    - `[logger]`：boolean/function，默认false，是否输出log，或者传入一个函数，函数接收一个代表执行sql字符串的参数
    - `[createdAt]`：：boolean/string，默认false，是否为表添加数据insert的时间字段，也可以传入一个字符串作为改字段名
    - `[updatedAt]`：boolean/string，默认false，是否为表添加数据update的时间字段，也可以传入一个字符串作为改字段名

- `DMServer.connect()`
  - 链接数据库，返回一个Promise

- `DMServer.server`
  - 使用达梦数据库官方驱动包建立的原始链接

- `DMServer.isOK`
  - 连接状态，可作为健康检查的判断依据

-  `DMServer.close()`
  - 关闭数据库连接

### 快速使用
```typescript
import { DmType, Model } from 'dmdb-orm';


interface TableModel {
    id: number
    f1: string
    f2: boolean
    f3: Date
}

const testModel = new Model<TableModel>('test', {
    id: {
        type: DmType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    f1: {
        type: DmType.STRING,
        allowNull: false,
        comment: 'string field',
        defaultValue: 'default value'
    },
    f2: {
        type: DmType.BOOLEAN
    },
    f3: {
        type: DmType.TIMESTAMP
    }
}, {});

testModel.find();
```

### 数据操作
- `Model constructor(tableName, struct[, option])`
  - `tableName`，表名称
  - `struct`，表结构定义
  - `[option]`，表的model选项
    - `[modelName]`，达梦数据库的表所在的模式，会覆盖连接数据库时的modelName设置
    - `[tenantId]`，多租户分表选项
    - `[createdAt]`，同连接数据库时设置的createdAt，如果设置，则覆盖之前连接数据库时的设置
    - `[updatedAt]`，同连接数据库时设置的updatedAt，如果设置，则覆盖之前连接数据库时的设置

- `Model.sync()`
  - 当表不存在时，创建表，返回一个Promise

- `Model.model`
  - 获取当前表的model

- `Model.table`
  - 获取当前表的名称

- `Model.db`
  - 使用达梦数据库官方驱动包建立的原始链接

- `Model.drop()`
  - 删除当前表，返回一个`Promise<void>`

- `Model.save(obj)`
  - 插入一条数据，返回`Promise<void>`

- `Model.saveMany(Array<obj>)`
  - 插入多条数据，返回`Promise<void>`

- `Model.delete(query)`
  - 删除数据，返回`Promise<void>`

- `Model.update(query， update)`
  - 更新数据，返回`Promise<void>`

<!-- - `Model.upsert()`
  -  -->

- `Model.find([query, projection])`
  - 查询数据，返回`Promise<Array<obj>>`

- `Model.findOne([query, projection])`
  - 查询一条数据，返回`Promise<obj | null>`

- `Model.findById(id[, projection])`
  - 查询一条数据，返回`Promise<obj | null>`

- `Model.paging(query, option:{skip, limit}[, projection])`
  - 分页查询，返回`Promise<{ list: Array<obj>, total: number }>`

- `Model.count([query])`
  - 查询数据量，返回`Promise<number>`

- `Model.compute(rule[, query])`
  - 简单的计算查询，支持`'min' | 'max' | 'avg' | 'median' | 'sum' | 'count'`
