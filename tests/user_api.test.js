const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')

const api = supertest(app)


describe('When there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('Users are returned as JSON', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Fetch all users in database', async () => {
        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(1)
    })

    test('Creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('Creation fails if username is already taken', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'root',
            name: 'Ana Banana',
            password: 'banana',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('Creation fails if username has less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'ab',
            name: 'Ana Banana',
            password: 'banana',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })

    test('Creation fails if username is not given', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            name: 'Ana Banana',
            password: 'banana',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })

    test('Creation fails if password is not given', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'anabanana',
            name: 'Ana Banana'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })

    test('Creation fails if password has less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'anabanana',
            name: 'Ana Banana',
            password: 'ab',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
