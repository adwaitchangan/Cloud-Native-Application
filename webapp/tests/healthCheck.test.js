import request from 'supertest';
import { sequelize } from '../apps/db.js';
import {initialize} from '../apps/app.js';
import { faker } from '@faker-js/faker';

jest.mock('../apps/logger/logger', () => {
  return {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  };
});

let app;

beforeAll(async () => {
  app = await initialize();
});

afterAll(async () => {
  await sequelize.close(); 
});

describe("Test Healthz API",  () => {

  test("Verify get healthz to verify good database connection", async () => {
    await request(app)
      .get("/healthz")
      .expect(200)
  });

  test("Verify get healthz to verify bad database connection", async () => {
    jest.spyOn(sequelize, 'authenticate').mockImplementation(() => {
      throw new Error('Connection failed');
    });
    const response = await request(app).get('/healthz');
    expect(response.status).toBe(503);
    jest.restoreAllMocks();
  });

  test('Verify response 400 Bad Request for a request with payload for get healthz', async () => {
    const response = await request(app).get('/healthz').send({ payload: 'data' });
    expect(response.status).toBe(400);
  });

  test('Verify response 405 Method Not Allowed for a non-GET request for healthz API', async () => {
    const response = await request(app).post('/healthz');
    expect(response.status).toBe(405);
  });
});

describe('Integration Tests for /v1/user endpoint', () => {

  let userId;
  const fakeFName = faker.person.firstName();
  const fakeLName = faker.person.lastName();
  const fakeEmail = faker.internet.email();
  const fakePassword = fakeFName+"@9999";
  const fakeUpdateFName = faker.person.firstName();
  const fakeUpdateLName = faker.person.lastName();
  const fakeUpdatePassword = fakeUpdateFName+"@9999";

  test('Verify account creation and validate existence with GET call', async () => {
    const createUserResponse = await request(app)
      .post('/v1/user')
      .send({
        "first_name" : fakeFName,
        "last_name" : fakeLName,
        "username" : fakeEmail,
        "password" : fakePassword
    });

    userId = createUserResponse.body.id;

    expect(createUserResponse.status).toBe(201);
    expect(createUserResponse.body).toHaveProperty('id');
    expect(createUserResponse.body.first_name).toBe(fakeFName);
    expect(createUserResponse.body.last_name).toBe(fakeLName);
    expect(createUserResponse.body.username).toBe(fakeEmail);

    const getUserResponse = await request(app)
      .get(`/v1/user/self`)
      .auth(fakeEmail, fakePassword);

    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body.id).toBe(userId);
    expect(getUserResponse.body.first_name).toBe(fakeFName);
    expect(getUserResponse.body.last_name).toBe(fakeLName);
    expect(getUserResponse.body.username).toBe(fakeEmail);
  });

  test('Verify update user account and validate with GET call', async () => {
    const updateUserResponse = await request(app)
      .put(`/v1/user/self`)
      .auth(fakeEmail, fakePassword)
      .send({
        first_name: fakeUpdateFName,
        last_name: fakeUpdateLName,
        password: fakeUpdatePassword
      });

    expect(updateUserResponse.status).toBe(204);

    const getUserAfterUpdateResponse = await request(app)
      .get(`/v1/user/self`)
      .auth(fakeEmail, fakeUpdatePassword);

    expect(getUserAfterUpdateResponse.status).toBe(200);
    expect(getUserAfterUpdateResponse.body.id).toBe(userId);
    expect(getUserAfterUpdateResponse.body.first_name).toBe(fakeUpdateFName);
    expect(getUserAfterUpdateResponse.body.last_name).toBe(fakeUpdateLName);
    expect(getUserAfterUpdateResponse.body.username).toBe(fakeEmail);
  });

});
