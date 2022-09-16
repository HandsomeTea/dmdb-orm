
### 快速使用
`startup.ts`
```typescript
import { DMServer } from 'dmdb-orm';

const service = new DMServer({
    connectString: 'dm://SYSDBA:SYSDBA@localhost:5236'
});

service.connect();

export default service;
```

### 数据操作
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
