import mongoose from "mongoose";
const mongouri = "mongodb+srv://msritop123:msritop123@rit-dataset.ypq0r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const connectdatabase = () => {
    mongoose.connect(mongouri,
        { useNewUrlParser: true, useUnifiedTopology: true }, err => {
            console.log('connected to MongoDB')
        });
}

module.exports = connectdatabase