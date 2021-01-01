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
        const userCredential = {
            username: "mluukkai",
            password: "pass1"
        }
        const userLogin = await api.post('/api/login').send(userCredential)
        
        const newBlog = {
            title: 'New blog',
            author: 'New author',
            url: 'www.newblog.com',
            likes: 18
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${userLogin.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        const urls = response.body.map(blog => blog.url)

        expect(response.body).toHaveLength(helper.initBlogs.length + 1)
        expect(urls).toContain('www.newblog.com')

        const i = _.findIndex(response.body, (blog) => blog.url === newBlog.url)
        expect(response.body[i].userId.username).toBe(userCredential.username)
    })

    test('Add new blog with likes property missing', async () => {
        const userCredential = {
            username: "mluukkai",
            password: "pass1"
        }
        const userLogin = await api.post('/api/login').send(userCredential)

        const newBlog = {
            title: 'New blog 2',
            author: 'New author 2',
            url: 'www.newblog2.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${userLogin.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        const i = _.findIndex(response.body, (blog) => blog.url === newBlog.url)

        expect(response.body[i].likes).toBe(0)
        expect(response.body[i].userId.username).toBe(userCredential.username)
    })

    test('Blog without title and url is not added', async () => {
        const userCredential = {
            username: "mluukkai",
            password: "pass1"
        }
        const userLogin = await api.post('/api/login').send(userCredential)

        const newBlog = {
            author: 'New author 3',
            likes: 50
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${userLogin.token}`)
            .expect(400)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initBlogs.length)
    })

    test('If a token is not provided, the blog is not added', async () => {
        const userCredential = {
            username: "mluukkai",
            password: "pass1"
        }
        const userLogin = await api.post('/api/login').send(userCredential)

        const newBlog = {
            title: 'New blog',
            author: 'New author',
            url: 'www.newblog.com',
            likes: 18
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initBlogs.length)
    })
})

describe('DELETE requests', () => {

    test('Delete existing blog', async () => {
        let response = await api.get('/api/blogs')
        const blogToDelete = response.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        response = await api.get('/api/blogs')
        const urls = response.body.map(blog => blog.url)
        expect(response.body).toHaveLength(helper.initBlogs.length - 1)
        expect(urls).not.toContain(blogToDelete.url)
    })
})

describe('UPDATE requests', () => {

    test('Update likes of an existing blog', async () => {
        let response = await api.get('/api/blogs')
        const blogToUpdate = response.body[0]
        const newLikes = 34
        const updatedBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: newLikes
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
        
        response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initBlogs.length)
        expect(response.body[0].likes).toBe(newLikes)
    })

    test('Fails for update of existing blogs with missing title and url', async () => {
        let response = await api.get('/api/blogs')
        const blogToUpdate = response.body[0]
        const newLikes = 34
        const updatedBlog = {
            author: blogToUpdate.author,
            likes: newLikes
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(400)
        
        response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initBlogs.length)
        expect(response.body[0]).toEqual(blogToUpdate)
    })
})


afterAll(() => {
    mongoose.connection.close()
})