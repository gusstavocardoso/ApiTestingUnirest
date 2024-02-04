import { describe, expect, test } from 'vitest';
const unirest = require('unirest');
const { books } = require('../data/books.json');
const dotenv = require('dotenv');
dotenv.config({ override: true });

let token;
let bookingId;

const BASE_URL = process.env.BASE_URL;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

describe('Testing restful-booker API with Unirest', () => {
  test('Should generate token', async () => {
    await unirest
      .post(`${BASE_URL}/auth`)
      .headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .send({ username: USERNAME, password: PASSWORD })
      .then(function (res) {
        token = res.body.token;
        expect(res.status).toBe(200);
      });
  });

  test('Should register a book', async () => {
    await unirest
      .post(`${BASE_URL}/booking`)
      .headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      })
      .send(JSON.stringify(books.create))
      .then(function (res) {
        bookingId = res.body.bookingid;
        expect(res.status).toBe(200);
      });
  });

  test('Should update a book', async () => {
    await unirest
      .put(`${BASE_URL}/booking/${bookingId}`)
      .headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      })
      .send(JSON.stringify(books.update))
      .then(function (res) {
        expect(res.status).toBe(200);
      });
  });

  test('Should remove a book', async () => {
    await unirest
      .delete(`${BASE_URL}/booking/${bookingId}`)
      .headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      })
      .then(function (res) {
        expect(res.status).toBe(201);
      });
  });
});
