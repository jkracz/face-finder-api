const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: "08e81ce8f9e34023b240c6b7595bf067"
  });

const handleClarifaiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json("error processing your image"));
}

const addImage = (req, res, db) => {
    const { id, url } = req.body;

    db('users').returning('entries')
    .where('id', '=', id)
    .increment('entries', 1)
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
    addImage: addImage,
    handleClarifaiCall: handleClarifaiCall
}