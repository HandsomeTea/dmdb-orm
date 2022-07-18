import dmdb from "dmdb"

declare var ORM_DMDB_SERVER: dmdb.Connection | null;
declare var ORM_DMDB_SETTING: DmdbCustomSetting;

export interface DmdbCustomSetting {
    modelName: string
    createdAt?: string
    updatedAt?: string
    /** default: iso */
    timezone?: 'iso' | 'local'
}
