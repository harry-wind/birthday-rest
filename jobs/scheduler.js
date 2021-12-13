process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { parentPort} from  'worker_threads';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import axios from 'axios';

const isCancelled = false;
const dateYear = new Date().getFullYear();
const dateMonth = new Date().getMonth(); // start counting from 0
const dateDay = new Date().getDate();// start counting from 1

if (parentPort) {
    parentPort.once("message", (message) => {
      if (message === "cancel") isCancelled = true;
    });
  }

function cancel() {
    if (parentPort) parentPort.postMessage('cancelled');
    else process.exit(0);
}

(async () => {
    mongoose.connect("mongodb://localhost:27017/birthday", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const url = 'https://hookb.in/nPKQmqr10riZ7Qrr7Gy1';

    const allUser = await User.find( { msgSent: false } ).exec();

    await Promise.all(
        allUser.map( async (msg) => {
            return new Promise(async (resolve, reject) => {
                
                try {
                    if (isCancelled) return;
    
                    console.log('===============================================');
                    const user = await User.findById({ _id: msg._id }).exec();
                    await User.findOneAndUpdate({ _id: user._id}, {msgRunning: true});

                    const fullname = user.firstname + ' ' + user.lastname;
                    // console.log('fullname:' + fullname);

                    const dD = moment(user.birthdate).date();
                    const dM = moment(user.birthdate).month();

                    // console.log('DateDay:' + dateDay);
                    // console.log('dD:' + dD);
    
                    if (dateDay == dD && dateMonth == dM) {
                        try {
                        
                            const data = JSON.stringify({ message: "Hei, " + fullname + " it's your birthday!"});
                            console.log('data:' + data);

                            const req = await axios.post(url, data).then(res => {
                                console.log('req sent');
                            });
                            // req.write(data);
                            // req.end();
                            await User.findOneAndUpdate({ _id: user._id}, {msgSent: true});
                            resolve();

                        } catch (error) {
                            console.log(error);   
                            await User.findOneAndUpdate({ _id: user._id}, {msgRunning: false});
                            resolve();   
                            // cancel();                 
                        }
                        
                    } else {
                        console.log('Not ' + fullname + ' Birthday');

                        resolve();
                    } 
                    

                } catch (error) {                    
                    reject(error);
                }
            });
        })
    );
    if (parentPort) parentPort.postMessage("done");
    else process.exit(0);
})();