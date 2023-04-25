const initSqlJs = require('sql.js');
import sqlWasm from '!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm';

// const fs = require('fs');

// const initSqlJs = require('./sql-wasm.js');
// const initSqlJs = require('sql-wasm.js');

// import {baseUrl} from '@/_config';

class DatabaseManager {
  async createDatabase() {
    const SQL = await initSqlJs({locateFile: () => sqlWasm});
    this.db = new SQL.Database();
  }

  async runQuery(query) {
    this.db.run(query);
  }

  async executeQuery(query) {
    return this.db.exec(query);
  }

  async createTableUsers() {
    this.db.run(
      'CREATE TABLE IF NOT EXISTS users (name VARCHAR, username VARCHAR, email VARCHAR)'
    );
  }
}

export default new DatabaseManager();
