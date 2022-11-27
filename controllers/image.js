const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_API}`);

const handleClarifaiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return res.status(400).json("error processing image");
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return res.status(400).json("error processing image");
            }
            res.json(response);
        }
    );
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