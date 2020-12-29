/*eslint-env es6*/

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('GET requests to /api/blogs', () => {

    test('Notes are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test(`There are ${helper.initBlogs.length} notes`, async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initBlogs.length)
    })

    test('Verify existence of id property', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
        blogs.forEach(blog => {
            expect(blog.id).toBeDefined()
        })
    })
})

describe('POST requests to /api/blogs', () => {

    test('Add new blog to database', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'New author',
            url: 'www.newblog.com',
            likes: 18
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        const urls = response.body.map(blog => blog.url)

        expect(response.body).toHaveLength(helper.initBlogs.length + 1)
        expect(urls).toContain('www.newblog.com')
    })
})


afterAll(() => {
    mongoose.connection.close()
})