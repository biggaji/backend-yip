import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { userCollection } from './configs/db.js';
import { ObjectId } from 'mongodb';

// Express
const app = express();

// Middlewares that allows correct parsing of argurments from the request object - request.query, request.params;
app.use(express.urlencoded({ extended: false }));
// For request.body
app.use(express.json());

app.get('/', (request, response) => {
  response.status(200).json({
    message: 'RESTAPI root',
  });
});

/** FIG 1.0
 * User Account
 * firstname
 * lastname
 * email
 * dob
 * bio
 * createdAt
 * updateAt
 */

// CRUD
// Create Read Update Delete

// Status code 201
app.post('/users', async (request, response, next) => {
  try {
    console.log(request.body)
    const { firstname, lastname, email, dob, bio } = request.body;

    // Validation
    if (!firstname || !lastname || !email || !dob || !bio) {
      throw new Error('All fields are required');
    }

    const insertUserResult = await userCollection.insertOne({
      firstname,
      lastname,
      bio,
      email,
      dob,
    });

    response.status(201).json({
      success: true,
      message: 'New user account created',
    });
  } catch (error) {
    next(error);
  }
});

// Returns all users
// Status code 200
app.get('/users', async (request, response, next) => {
  try {
    const users = await userCollection.find().toArray();
    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

/**
 *  Returns a single user if found by it id, else it throws an error
 */
// Status code 200
app.get('/users/:id', async (request, response, next) => {
  try {
    const userId = request.params.id;
    // "_id" : ObjectId("5d71522dc452f78e335d2d8b")
    const user = await userCollection.find({"_id": ObjectId(userId)}).toArray();
    response.status(200).json(user);
  } catch(error) {
    next(error)
  }
});

// Status code 200
// FIelds to be updated are within the approved limit. Check FIG 1.0 for approved fields
// Updates a user by it id and returns a message telling us if is successful or not
// Throw an error if request was unsuccessful
app.patch('/users/:id', async (request, response, next) => {
  try {
    const userId = request.params.id;
    let newInformation = {};
    const { firstname, lastname, email, dob, bio } = request.body;

    if (firstname) newInformation.firstname = firstname;
    if (lastname)  newInformation.lastname = lastname;
    if (email) newInformation.email = email;
    if (dob) newInformation.dob = dob;
    if (bio) newInformation.bio = bio;

    const patchedUser = await userCollection.updateOne(
      {"_id": ObjectId(userId)}, // Filter parameter
      {$set: newInformation} 
    )

    response.status(200).json(patchedUser)

  } catch(error) {
    next(error)
  }
});

// Status 204
// Delete a user by it id if found, else throw an error
app.delete('/users/:id', async( request, response, next) => {
  try {
    const userId = request.params.id;
    const deleteResult = await userCollection.deleteOne({"_id": ObjectId(userId)})
    response.staus(204).json({message: "User deleted"})
  } catch(error) {
    next(error)
  }
});

// Delete all users, else throw an error
app.delete('/users', async( request, response, next) => {
  try {
    const userId = request.params.id;
    const deleteResult = await userCollection.deleteMany();
    response.staus(200).json({message: "All users deleted"})
  } catch(error) {
    next(error)
  }
});

// Central error processing middleware
app.use((error, request, response, next) => {
  response.status(500).json({
    error: error.message,
  });
});

app.listen(3000, () => {
  console.log(`API server is running on port 3000`);
});
