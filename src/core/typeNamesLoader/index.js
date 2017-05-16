import module from '../../module'
import loader from '../../components/loader'
import { exec } from 'child-process-promise'
import parse from 'csv-parse/lib/sync'

export default module(
    loader(async state => {
        try {
            const exists = await state.db.get(`
                SELECT name FROM sqlite_master
                WHERE type='table' AND
                name='typeNames'
            `);

            if (!exists) {
                // This is terrible and I hate myself but we do what we must
                // Also no one else will ever see this, but if they do:
                // TODO: Refactor to use NPM packages or something more elegant than this BS
                console.log('Generating typeNames table...');
                console.log('Downloading invTypes data...');

                const {stdout: csv} = await exec(
                    'curl https://www.fuzzwork.co.uk/dump/latest/invTypes.csv.bz2 | gunzip', {
                    maxBuffer: 1024 * 1024 * 20, // 20 MB,
                    encoding: 'utf-8'
                });

                console.log('Parsing...');

                const records = parse(csv);

                console.log('Building database...');

                await state.db.run(`
                    CREATE VIRTUAL TABLE IF NOT EXISTS typeNames USING fts5(ID, typeName,
                        tokenize = "ascii separators '-'",
                    )
                `);

                let row = 0;
                for(let record of records) {
                    if (row != 0) {
                        await state.db.run(`
                            INSERT INTO typeNames (ID, typeName)
                            VALUES ($ID, $typeName)
                        `, {
                            $ID: record[0],
                            $typeName: record[2]
                        })
                    }
                    row++
                }

                console.log(`Done. Inserted ${row - 1} rows.`)
            }
        } catch(e) {
            throw e
        }
    })
)