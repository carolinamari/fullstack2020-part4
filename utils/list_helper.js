/*eslint-env es6*/
const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum += blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((favBlog, blog) => {
        if (blog.likes > favBlog.likes) {
            favBlog = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }

        return favBlog
    }, { likes: -1 })

    return favorite.likes === -1 ? null : favorite
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authors = blogs.map(blog => blog.author)
    const countBlogs = _.countBy(authors)
    const authorBlogs = _.map(countBlogs, (value, key) => {
        return {
            author: key,
            blogs: value
        }
    })

    return _.maxBy(authorBlogs, 'blogs')
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const blogsGroupedByAuthors = _.groupBy(blogs, 'author')
    const authorsAllLikes = _.mapValues(blogsGroupedByAuthors, blogList => {
        const totalLikes = _.map(blogList, (blog) => blog.likes)
        return _.sum(totalLikes)
    })

    const authorsLikes = _.map(authorsAllLikes, (value, key) => {
        return {
            author: key,
            likes: value
        }
    })
    
    return _.maxBy(authorsLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}