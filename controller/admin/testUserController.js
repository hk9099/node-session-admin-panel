


module.exports.testUser = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users');
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

module.exports.submitForm = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO users (name, email) VALUES ($1, $2)', [req.body.name, req.body.email]);
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

