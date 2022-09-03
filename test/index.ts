import { DMServer } from '../src/dmdb';
import { Model, DmType } from '../src/model';
import { DBError } from 'dmdb';

const server = new DMServer({
    // connectString: 'dm://SYSDBA:surpass1234@10.184.102.120:5236'
    connectString: 'dm://SYSDBA:SYSDBA@localhost:5236'
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

server.connect().then(() => {
    testModel.find({
        order: [{ id: 'asc' }]
    });
    // eslint-disable-next-line no-console
}).catch((e: DBError) => console.log(e.message));
