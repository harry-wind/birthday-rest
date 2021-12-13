import mongoose from 'mongoose';

const User = mongoose.Schema({
    firstname: {
        type: 'string',
        required: true
    },
    lastname: { 
        type: 'string'
    },
    birthdate: {
        type: 'date',
        required: true
    },
    cityId: {
        type: 'number',
        required: true
    },
    msgSent:{
        type: 'boolean',
        default: false
    },
    msgRunning:{
        type: 'boolean',
        default: false
    }
});

export default mongoose.model('User', User);