import * as Mongoose from 'mongoose';
let database: Mongoose.Connection;
export const mongoConnection = async () => {
    await new Promise((res, rej) => {
        const uri = process.env.MONGO_URL;
        if (database) {
            return;
        }
        Mongoose.connect(uri, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        database = Mongoose.connection;
        database.once('open', () => {
            console.log('Connected to database');
            res(true);
        });
        database.on('error', () => {
            console.log('Error connecting to database');
            rej(new Error('Error connecting to database'));
        });
    });
};
