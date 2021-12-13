import express from "express";

import { 
    getUser, getUserById, saveUser, updateUser, deleteUser
} from "../../controllers/userController.js";

const user = express.Router('/api/user');

user.get('/', getUser);
user.get('/:id', getUserById);
user.post('/', saveUser);
user.delete('/:id', deleteUser);
user.put('/:id', updateUser);

export default user;