const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, '../db/database.db'));

// Used to load in typeIDs/typenames from a CSV to the local sqlite database
// If anybody else ever looks at this forgive me for what I have done

// Syntax: node loadTypeIds.js filepath typeIDColumn typeNameColumn

const filePath = path.resolve(process.cwd(), process.argv[2]);
const typeIDColumn = process.argv[3] - 1;
const typeNameColumn = process.argv[4] - 1;

const parser = parse({escape: '\\'});

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS typeIDs`);
    db.run(
        `CREATE TABLE typeIDs (
            typeName TEXT PRIMARY KEY,
            typeID INTEGER
        )`
    )
});

let rows = 0;

parser.on('readable', () => {
    let record;
    const stmt = db.prepare(`INSERT INTO typeIDs VALUES ($typeName, $typeID)`);

    while(record = parser.read()) {
        stmt.run({
            $typeName: record[typeNameColumn],
            $typeID: parseInt(record[typeIDColumn], 10)
        }, err => {
            if (err) {
                console.log(err);
                console.log(`At row ${rows}`);
            }
        });
        rows++
    }

    stmt.finalize();
});

parser.on('finish', () => {
    console.log(`Inserted ${rows} rows.`);
});

parser.on('error', err => {
    console.log(err);
    console.log(`At row ${rows}`);
});

const input = fs.createReadStream(filePath);
input.pipe(parser);