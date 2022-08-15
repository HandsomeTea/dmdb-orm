import { DMServer } from '../src/dmdb';
import { Model, DmType } from '../src/model';

new DMServer({
    connectString: 'dm://SYSDBA:surpass1234@10.184.102.120:5236'
}, {
    modelName: 'test',
    createdAt: true
});

interface testTableModel {
    id: string
    f1: number
    f2: boolean
    f3: Date
}

const testModel = new Model<testTableModel>('test', {
    id: {
        type: DmType.STRING
    },
    f1: {
        type: DmType.NUMBER
    },
    f2: {
        type: DmType.STRING
    },
    f3: {
        type: DmType.DATE
    }
});

// eslint-disable-next-line no-console
console.log(testModel.table);

testModel.find({
    order: [{ id: 'asc' }]
});
