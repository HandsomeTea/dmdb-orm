import { Model, DmType, DMServer } from '../index';
import { DBError } from 'dmdb';

const server = new DMServer({
    connectString: 'dm://SYSDBA:SYSDBA@10.184.102.101:5236'
}, {
    modelName: 'testDB',
    createdAt: true,
    logger: true
});

interface testTableModel {
    id?: number
    f1?: string
    f2: boolean
    f3: Date
}

const testModel = new Model<testTableModel>('test', {
    id: {
        type: DmType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    f1: {
        type: DmType.STRING(132),
        allowNull: false,
        comment: 'f1comment'
    },
    f2: {
        type: DmType.BOOLEAN,
        unique: true,
        comment: 'boolean test'
    },
    f3: {
        type: DmType.DATE
    }
}, {});

server.connect().then(async () => {
    await testModel.sync();
    // await testModel.save({
    //     f1: 'null',
    //     f2: true,
    //     f3: new Date()
    // });
    // await testModel.saveMany([{
    //     f1: 'test',
    //     f2: false,
    //     f3: new Date()
    // }, {
    //     f1: 'tesat1,tesat2,tesat3,test',
    //     f2: true,
    //     f3: new Date()
    // }]);
    // await testModel.upsert({ where: { id: 3 } }, { f2: false }, {
    //     id: 4,
    //     f1: 'string',
    //     f2: true,
    //     f3: new Date()
    // });
    // await testModel.update({ where: { f1: 'null' } }, { f1: 'new string' });
    // await testModel.delete({ where: { id: 4 } });
    // console.log(await testModel.update({
    //     where: {
    //         f1: {
    //             $regexp: new RegExp('t1')
    //         }
    //     }
    // }, { f1: { $pull: ['tesat2', 'test'], $split: ',' } }));
    // console.log(await testModel.paging({}, { skip: 0, limit: 2 }));
    // eslint-disable-next-line no-console
}).catch((e: DBError) => console.log(e.message));
