/*eslint-env es6*/

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('userId', { username: 1, name: 1 })
    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const user = await User.findById(request.body.userId)

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes === undefined ? 0 : request.body.likes,
        userId: user._id
    })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    const updatedBlog = await Blog.findOneAndUpdate({ _id: request.params.id }, blog, options)
    response.json(updatedBlog)
})

module.exports = blogsRouter