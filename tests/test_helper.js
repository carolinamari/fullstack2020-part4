const Blog = require('../models/blog')
const User = require('../models/user')

const initBlogs = [
    {
        title: "Blog 1",
        author: "Author 1",
        url: "www.blog1.com",
        likes: 10,
        userId: '5fef3a07252805332cca94f0'
    },
    {
        title: "Blog 2",
        author: "Author 2",
        url: "www.blog2.com",
        likes: 20,
        userId: '5fef3a07252805332cca94f0'
    },
    {
        title: "Blog 3",
        author: "Author 3",
        url: "www.blog3.com",
        likes: 30,
        userId: '5fef3a07252805332cca94f0'
    },
    {
        title: "Blog 4",
        author: "Author 4",
        url: "www.blog4.com",
        likes: 40,
        userId: '5fef3a07252805332cca94f0'
    },
    {
        title: "Blog 5",
        author: "Author 5",
        url: "www.blog5.com",
        likes: 50,
        userId: '5fef3a07252805332cca94f0'
    }
]

const initUser = {
    username: 'root',
    name: 'root',
    password: 'admin'
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { 
    initBlogs,
    initUser,
    usersInDB
}