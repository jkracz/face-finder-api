const getProfileById = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where('id', id)
    .then(user => {
        if (user.length) {
            res.send(user[0]);
        } else {
            res.status(400).json('user not found')
        }
    })
    .catch(err => res.status(400).json("something went wrong. Try again later"));
}

module.exports = {
    getProfileById: getProfileById
}