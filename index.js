import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Bree from 'bree';
import userRoutes from './routes/User/index.js';

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/birthday", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('error', (error)=> console.error(error));
db.once('open', () => console.log('Database Connected'));

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);

const bree = new Bree( {
    jobs : [
      { 
        name: "scheduler", 
        cron: "* 9 * * *",
        cronValidate: {
          useBlankDay: true
        }
        // interval: "5s" 
      }
    ],
  });
  bree.start('scheduler');


app.listen(port, () => console.log('Server Running on port ' + port));