import mongoose from 'mongoose';

const MongoDB_URL = 'mongodb+srv://Ankit123:Ankit123@cluster0.ycktskw.mongodb.net/summarize'

const mongoDB_URL = MongoDB_URL

if(!mongoDB_URL) {
    throw new Error('Database URL not found') 
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn
    }
    console.log('DB..... connection')
    if(!cached.promise){
        mongoose
        .connect(mongoDB_URL)
        .then(() => mongoose.connection)
    }
    try{
        cached.conn = await cached.promise
    } 
    catch(err){
        cached.promise = null
        throw err
    }
    return cached.conn
}