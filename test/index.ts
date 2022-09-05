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
    id: number
    f1: string
    f2: boolean
    f3: Date
}

const testModel = new Model<testTableModel>('test', {
    id: {
        type: DmType.TINYINT
    },
    f1: {
        type: DmType.STRING,
        allowNull: false,
        comment: 'f1comment'
    },
    f2: {
        type: DmType.BOOLEAN,
        comment: 'boolean test'
    },
    f3: {
        type: DmType.DATE
    }
}, {});

server.connect().then(async () => {
    await testModel.sync();
    // await testModel.save({
    //     id: 3,
    //     f1: '123sss',
    //     f2: true,
    //     f3: new Date()
    // });
    // await testModel.upsert({ where: { id: 3 } }, { f2: false }, {
    //     id: 4,
    //     f1: 'string',
    //     f2: true,
    //     f3: new Date()
    // });
    // console.log(await testModel.find());
    // console.log(await testModel.paging({}, { skip: 0, limit: 2 }));
    // eslint-disable-next-line no-console
}).catch((e: DBError) => console.log(e.message));
