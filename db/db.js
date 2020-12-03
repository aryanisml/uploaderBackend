const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://adminusertest:zu9eLnZUBmgc87FW@cluster0.ka2fv.mongodb.net/dgpredb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});


// const   {mongoClient} = require('mongodb');
// const uri ='mongorestore --uri mongodb+srv://adminusertest:zu9eLnZUBmgc87FW@cluster0.ka2fv.mongodb.ne';
// const client = new MongoClient(uri);

// try {
//   await client.connect();
//   await listDatabases(client);

// } catch (e) {
//   console.error(e);
// }



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://adminusertest:zu9eLnZUBmgc87FW@cluster0.ka2fv.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('Connected my db...');
//   perform actions on the collection object
//   client.close();
// });
