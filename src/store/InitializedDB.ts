import {addRxPlugin, createRxDatabase} from 'rxdb';
import {RxDBDevModePlugin} from 'rxdb/plugins/dev-mode';
import {getRxStorageMemory} from 'rxdb/plugins/storage-memory';
import {RxDBMigrationPlugin} from 'rxdb/plugins/migration';
import {RxDBQueryBuilderPlugin} from 'rxdb/plugins/query-builder';
import {RxDBUpdatePlugin} from 'rxdb/plugins/update';
import {TodoSchema} from '../schemas/TodoSchema';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

export const STORAGE = getRxStorageMemory();
const DB_NAME = 'rxdb';
export const TODO_COLLECTION_NAME = 'todos';

const isDevelopment =
  process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';
export let db: any;
const initializeDB = async () => {
  if (isDevelopment) {
    addRxPlugin(RxDBDevModePlugin);
  }

  try {
    db = await createRxDatabase({
      name: DB_NAME,
      storage: STORAGE,
      multiInstance: false,
      ignoreDuplicate: true,
    });
    console.log('RxDB: DATABASE CREATED');
  } catch (err) {
    console.log('ERROR CREATING DATABASE', err);
  }

  try {
    await db.addCollections({
      [TODO_COLLECTION_NAME]: {
        schema: TodoSchema,
      },
    });
  } catch (err) {
    console.log('ERROR CREATING COLLECTION', err);
  }
};
export default initializeDB;
