import { ORM_DMDB_SETTING } from '../dmdb';

export default (sql: string) => {
    if (ORM_DMDB_SETTING.logger) {
        if (typeof ORM_DMDB_SETTING.logger === 'boolean') {
            // eslint-disable-next-line no-console
            console.debug(`dmdb execute sql: ${sql} \n`);
        } else {
            ORM_DMDB_SETTING.logger(sql);
        }
    }
};
