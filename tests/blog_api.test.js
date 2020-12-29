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

    test('There are 5 notes', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(5)
    })
})

test('Verify existence of id property', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

afterAll(() => {
    mongoose.connection.close()
})