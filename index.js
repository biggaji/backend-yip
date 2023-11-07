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
app.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Status code 200
// FIelds to be updated are within the approved limit. Check FIG 1.0 for approved fields
// Updates a user by it id and returns a message telling us if is successful or not
// Throw an error if request was unsuccessful
app.patch('/users/:id', async(req,res, next) => {
  try {
    const {id} = req.params;
    const user = await userCollection.findOne({_id: new ObjectId(id)});

    if (user) {
      const updatedUser = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: req.body});

      if (updatedUser.modifiedCount > 0) {
        res.status(200).json({
          data: updatedUser,
          message: 'User updated successfully'
        });
      } else {
        res.status(200).json({
          data: updatedUser,
          message: 'No modifications made to the user data'
        });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    next(error)
  }
});

// Status 204
// Delete a user by it id if found, else throw an error
app.delete('/users/:id', async(req,res,next) => {
  try {
    const {id} = req.params;
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (user) {
      const deletedUser = await userCollection.deleteOne({ _id: new ObjectId(id) });
      if (deletedUser.deletedCount > 0) {
        res.status(204).json({
          data: deletedUser,
          message: 'User deleted successfully'
        });
      } else {
        res.status(204).json({
          data: deletedUser,
          message: 'No user was deleted'
        });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }

  } catch (error) {
    next(error)
  }
});

// Delete all users, else throw an error
app.delete('/users', async(req,res, next) => {
  try {
    const deleteResult = await userCollection.deleteMany({});
    if (deleteResult.deletedCount > 0) {
      res.status(204).json({
        data: deleteResult,
        message: 'All users deleted successfully'
      });
    } else {
      res.status(204).json({
        data: deleteResult,
        message: 'No users were deleted'
      });
    }
  } catch (error) {
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
