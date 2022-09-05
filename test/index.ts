import { DMServer } from '../src/dmdb';
import { Model, DmType } from '../index';
import { DBError } from 'dmdb';

const server = new DMServer({
    connectString: 'dm://SYSDBA:SYSDBA@10.184.102.101:5236'
}, {
    modelName: 'testDB',
    createdAt: true,
    logger: true
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
        type: DmType.INTEGER
    },
    f2: {
        type: DmType.STRING
    },
    f3: {
        type: DmType.DATE
    }
}, {});

server.connect().then(async () => {

    await testModel.sync();
    testModel.find({
        order: [{ id: 'asc' }]
    });
    // eslint-disable-next-line no-console
}).catch((e: DBError) => console.log(e.message));
