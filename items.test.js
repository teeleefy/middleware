process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');
let coffee ={name: 'coffee', price : 1.45};

beforeEach(function() {
  global.items.push(coffee);
});

afterEach(function() {
  global.items.length = 0;
});

describe("GET /items", function() {
  it("gets all items", async function () {
    let response = await request(app).get('/items');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({items: [coffee]});
    
  });
});

describe("GET /tacos", function() {
  it("shows error when something is not found", async function () {
    let response = await request(app).get('/tacos');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({"error": {
		    "message": "Page not found",
		    "status": 404}});
  });
});

describe("GET /items/coffee", function() {
  it("gets coffee JSON", async function() {
    let response = await request(app).get('/items/coffee');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({item: coffee});
  });
});

describe("DELETE /items/coffee", function() {
  it("deletes coffee JSON", async function() {
    let response = await request(app).delete('/items/coffee');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({message: 'Deleted'});
    expect(items.length).toEqual(0);
  });
});

describe("DELETE /items/tacos", function() {
  it("shows error when something is not found in delete request", async function () {
    let response = await request(app).delete('/items/tacos');
    expect(response.statusCode).toBe(404);
    expect(response.body.error.message).toEqual("Oops! Could not find item!");
  });
});

describe("POST /items", function() {
  it("adds tea to items", async function() {
    let response = await request(app).post('/items').send({name: 'tea', price: 1.25});
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({added: {name: 'tea', price: 1.25}});
    expect(items.length).toEqual(2);
  });
});

describe("POST /items", function() {
  it("shows error when something is missing in post request", async function () {
    let response = await request(app).post('/items').send({name: 'tea', price: ""});
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toEqual('Oops! An item needs a numerical price!');
    response = await request(app).post('/items').send({name: '', price: 1.25});
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toEqual('Oops! An item needs a name!');
  });
});

describe("POST /items", function() {
  it("shows error when adding a duplicate item", async function () {
    let response = await request(app).post('/items').send({name: 'coffee', price: 3});
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toEqual('Oops! There is already an item with that name!');
  });
});

describe("PATCH /items/coffee", function() {
  it("updates coffee name and price", async function() {
    let response = await request(app).patch('/items/coffee').send({name: 'latte', price: 3.25});
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({updated: {name: 'latte', price: 3.25}});
    expect(items.length).toEqual(1);
  });
});
