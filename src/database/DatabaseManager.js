import initSqlJs from '!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm';
// const fs = require('fs');

// const initSqlJs = require('./sql-wasm.js');
// const initSqlJs = require('sql-wasm.js');

// import {baseUrl} from '@/_config';

class DatabaseManager {
  async createDatabaseFromFile() {
    initSqlJs().then(function (SQL) {
      // Load the db
      this.db = new SQL.Database(filebuffer);
    });
  }
  async executeQuery(query) {
    return this.db.exec(query);
  }

  async createTable(query) {
    this.db.run(query);
  }
}

export default new DatabaseManager();
