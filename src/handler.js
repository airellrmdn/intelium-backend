const axios = require('axios');
const authentication = require('./authGoogle');

const id_fish = '1gue0TVPAOuJSgDejCa6Q4VdXmY0iy_rjNZfbgpK7nIc';
const id_sensor = '17j1KF6QFjZpQmFWkrIYcc3OWdDMVZlpbeC0UAA5yTOY';

const getFish = async (req, res) => {
    let data = [];
    try {
        const { sheets } = await authentication();

        const read = await sheets.spreadsheets.values.get({
            spreadsheetId: id_fish,
            range: 'sheet1!A2:I',
        });

        const rows = read.data.values;
        if (!rows || rows.length === 0) {
            console.log('No Data Found');
            res.send({ message: 'No Data Found' });
        }
        
        for (let i = 0; i < rows.length; i++) {
            rows[i].splice(6, 1);
            data[i] = {
                ikan_id: rows[i][0],
                nama_ikan: rows[i][1],
                ph_min: rows[i][2],
                ph_maks: rows[i][3],
                suhu_min: rows[i][4],
                suhu_maks: rows[i][5],
                harga: rows[i][6],
                image_link: rows[i][7],
            };
        }
        res.json({ data: data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

const getSensor = async (req, res) => {
    let data = [];
    try {
        const { sheets } = await authentication();

        const read = await sheets.spreadsheets.values.get({
            spreadsheetId: id_sensor,
            range: 'sheet1!A2:B',
        });

        const rows = read.data.values;
        if (!rows || rows.length === 0) {
            console.log('No Data Found');
            res.send({ message: 'No Data Found' });
        }
        
        for (let i = 0; i < rows.length; i++) {
            data[i] = {
                suhu: rows[i][0],
                pH: rows[i][1],
            };
        }
        res.json({ sensor: data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

const servo = async (req, res) => {
    try {
        const date = new Date();
        const { sheets } = await authentication();

        axios.post('https://678c-182-3-39-49.ngrok-free.app/servo')
                .then(function (response) {
                    console.log(response.data);
                    //Perform action based on response
                })
                .catch(function (error) {
                    console.log(error);
                    //Perform action based on error
                });

        const writeReq = await sheets.spreadsheets.values.append({
            spreadsheetId: id_sensor,
            range: 'sheet1!I2:I',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [date],
                ]
            }
        });

        if (writeReq.status === 200) {
            return res.send({ message: 'Feed Success!' });
        }
        res.send({ message: 'Something went wrong while feeding!' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

const getFeederHistory = async (req, res) => {
    let total;
    try {
        const { sheets } = await authentication();

        const read = await sheets.spreadsheets.values.get({
            spreadsheetId: id_sensor,
            range: 'sheet1!F2:G',
        });

        const rows = read.data.values;
        if (!rows || rows.length === 0) {
            console.log('No Data Found');
            res.send({ message: 'No Data Found' });
        }
        total = rows[0][1];
        rows[0].splice(1,1);
        res.json({ 
            feed_total: total,
            feed_history: rows 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

module.exports = { getFish, getSensor, getFeederHistory, servo };
