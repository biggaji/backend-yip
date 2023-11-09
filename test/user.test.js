import { app } from '../index.js';
import request from 'supertest';
import { expect } from 'chai'; // I've removed unnecessary imports

describe('Users Endpoint', () => {
  it('Should return an array of users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.include('application/json'); // Check content type
    expect(response.body).to.be.an('array'); // Check if the response body is an array
  });

  it('Should create a new user', async () => {
    const user = {
      firstname: 'Adeyemi',
      lastname: 'Adenuga',
      bio: 'Chief of softlife',
      email: 'adenuga@softlife.com',
      dob: '2001/03/15',
    };

    const response = await request(app).post('/users').send(user);
    expect(response.status).to.equal(201);
    expect(response.headers['content-type']).to.include('application/json');
    expect(response.body).to.be.an('object');
  });

  it('Should not create a new user', async () => {
    const user = {
      firstname: 'Adeyemi',
      lastname: 'Adenuga',
      email: 'adenuga@softlife.com',
      dob: '2001/03/15',
    };

    const response = await request(app).post('/users').send(user);
    expect(response.status).to.equal(500);
    expect(response.headers['content-type']).to.include('application/json');
    expect(response.body).to.be.an('object');
  });

  it('Should throw an Error', async () => {
    const user = {
      firstname: 'Adeyemi',
      lastname: 'Adenuga',
      email: 'adenuga@softlife.com',
      dob: '2001/03/15',
    };

    try {
      await request(app).post('/users').send(user);
    } catch (error) {
      expect(error).to.throw(Error);
      expect(error.message).to.equal('All fields are required');
    }
  });
});
