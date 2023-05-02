const initSqlJs = require('sql.js');
import sqlWasm from '!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm';

// const fs = require('fs');

// const initSqlJs = require('./sql-wasm.js');
// const initSqlJs = require('sql-wasm.js');

// import {baseUrl} from '@/_config';
class DatabaseManager {
  async createDatabase(dbChunks) {
    const SQL = await initSqlJs({locateFile: () => sqlWasm});
    return new SQL.Database(dbChunks);
  }

  
}

export default new DatabaseManager();
