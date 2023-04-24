import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";
const initSqlJs = require("sql.js");

class DatabaseManager {
  async createDatabase() {
    const SQL = await initSqlJs({ locateFile: () => sqlWasm });
    this.db = new SQL.Database();
  }

  async executeQuery(query) {
    return this.db.exec(query);
  }

  async createTable(query) {
    this.db.run(query);
  }
}

export default new DatabaseManager();
