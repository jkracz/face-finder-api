const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("must enter credentials")
    }
    db.where('email', '=', email)
    .select('email', 'hash')
    .from('login')
    .then(login => {
        if (login.length && bcrypt.compareSync(password, login[0].hash)) {
            return db.select('*').from('users').where('email', '=', login[0].email)
            .then(data => res.json(data[0]))
            .catch(err => res.status(400).json("error logging in"));
        } else {
            res.status(400).json("wrong credentials");
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).json("error logging in");
    });
}

module.exports = {
    handleSignin: handleSignin
}