/*eslint-env es6*/

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('GET requests to /api/blogs', () => {

    test('Notes are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('There are 4 notes', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(4)
    })
})

afterAll(() => {
    mongoose.connection.close()
})