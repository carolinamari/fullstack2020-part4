/*eslint-env es6*/

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const _ = require('lodash')

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

    test('Add new blog with likes property missing', async () => {
        const newBlog = {
            title: 'New blog 2',
            author: 'New author 2',
            url: 'www.newblog2.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        const i = _.findIndex(response.body, (blog) => blog.url === newBlog.url)

        expect(response.body[i].likes).toBe(0)
    })

    test('Blog without title and url is not added', async () => {
        const newBlog = {
            author: 'New author 3',
            likes: 50
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initBlogs.length)
    })
})


afterAll(() => {
    mongoose.connection.close()
})