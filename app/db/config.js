const mysql = require('mysql');
const databaseConnection = mysql.createConnection({
    host: "localhost",
    user: "root"
});
class Database{
    constructor() {
        databaseConnection.connect((err) => {
            if (err) throw err;
            console.log("Connected!");
            databaseConnection.query("CREATE DATABASE IF NOT EXISTS MusicianGroupNew", function (err, result) {
                if (err) throw err;
                // console.log("Database created");
            });

            setTimeout(async () => {
                await this.perform(`
                CREATE TABLE IF NOT EXISTS \`MusicianGroupNew\`.\`users\` (
                  \`id\` INT NOT NULL AUTO_INCREMENT,
                  \`email\` VARCHAR(1024) NULL,
                  \`first_name\` VARCHAR(1024) NOT NULL,
                  \`surname\` VARCHAR(1024) NOT NULL,
                  \`last_name\` VARCHAR(1024) NOT NULL,
                  \`date_of_birthday\` DATETIME NOT NULL,
                  \`photo\` VARCHAR(1024) NULL,
                  \`password_hash\` VARCHAR(256) NULL,
                  \`description\` VARCHAR(2048) NULL,
                  \`created_at\` DATETIME NOT NULL,
                  \`modified_at\` DATETIME NOT NULL,
                  PRIMARY KEY (\`id\`))
                  ENGINE = InnoDB;
                `);
                await this.perform(`
                CREATE TABLE IF NOT EXISTS \`MusicianGroupNew\`.\`songs\` (
                  \`id\` INT NOT NULL AUTO_INCREMENT,
                  \`title\` VARCHAR(1024) NOT NULL,
                  \`song\` VARCHAR(1024) NOT NULL,
                  \`poster\` VARCHAR(1024) NULL,
                  \`created_at\` DATETIME NOT NULL,
                  \`modified_at\` DATETIME NOT NULL,
                  PRIMARY KEY (\`id\`))
                  ENGINE = InnoDB;
                `);
                await this.perform(`
                CREATE TABLE IF NOT EXISTS \`MusicianGroupNew\`.\`concerts\` (
                  \`id\` INT NOT NULL AUTO_INCREMENT,
                  \`place\` VARCHAR(1024) NOT NULL,
                  \`date\` DATETIME NOT NULL,
                  \`created_at\` DATETIME NOT NULL,
                  \`modified_at\` DATETIME NOT NULL,
                  PRIMARY KEY (\`id\`))
                  ENGINE = InnoDB;
                `);
                await this.perform(`
                CREATE TABLE IF NOT EXISTS \`MusicianGroupNew\`.\`comments\` (
                  \`id\` INT NOT NULL AUTO_INCREMENT,
                  \`email\` VARCHAR(1024) NOT NULL,
                  \`avatar\` VARCHAR(1024) NULL,
                  \`message\` VARCHAR(1024) NOT NULL,
                  \`created_at\` DATETIME NOT NULL,
                  \`modified_at\` DATETIME NOT NULL,
                  PRIMARY KEY (\`id\`))
                  ENGINE = InnoDB;
                `);

            }, 2500);

            databaseConnection.query("SET SESSION wait_timeout = 604800"); // 7 days timeout
        })
    }

    async perform(sql, ...params) {
        return new Promise(((resolve, reject) => {
            databaseConnection.query(sql, params, function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        }))
    }
}

let database = new Database();
exports.databaseConnection = database;
