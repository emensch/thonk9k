import module from '../../module'
import loader from '../../components/loader'
import download from 'download'
import bzip2 from 'seek-bzip'
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
                console.log('Generating typeNames table...');
                console.log('Downloading invTypes data...');

                const file = await download('https://www.fuzzwork.co.uk/dump/latest/invTypes.csv.bz2');
                const csv = bzip2.decode(file);

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