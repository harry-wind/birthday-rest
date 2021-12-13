import User from '../models/userModel.js';
import moment from 'moment';

export const getUser = async (req, res) => {
    try {
        const _user = await User.find();
        res.json(_user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const getUserById = async (req, res) => {
    try {
        const _user = await User.findById(req.params.id);
        res.json(_user);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
     
}

export const saveUser =  async (req, res) => {
    const _user = new User(req.body);
    try {
        const savedUser = await _user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const updateUser = async (req, res) => {
    const cekId = await User.findById(req.params.id);

    if (!cekId) {
        return res.status(404).json({message: "User Not Found"});
    }

    try {
        const updateUser = await User.updateOne(cekId, req.body);
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const deleteUser = async (req, res) => {
    const cekId = await User.findById(req.params.id);

    if (!cekId) {
        return res.status(404).json({message: "User Not Found"});
    }

    try {
        const deleteUser = await User.deleteOne({id: cekId});
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}