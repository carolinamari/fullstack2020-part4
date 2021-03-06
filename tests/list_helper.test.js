/*eslint-env es6*/

const listHelper = require('../utils/list_helper')
const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const readyMadeBlogList = [ 
    { 
        _id: "5a422a851b54a676234d17f7", 
        title: "React patterns", 
        author: "Michael Chan", 
        url: "https://reactpatterns.com/", 
        likes: 7,
        __v: 0 
    }, 
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0 
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const listWithMultipleBlogs = [
    {
        _id: "5fea2cea93c6501cccda5c81",
        title: "Blog 1",
        author: "Author 1",
        url: "www.blog1.com",
        likes: 10,
        __v: 0
    },
    {
        _id: "5fea30352074ab1de400e0b5",
        title: "Blog 2",
        author: "Author 2",
        url: "www.blog2.com",
        likes: 20,
        __v: 0
    },
    {
        _id: "5fea3a4012171d0fb8b7af20",
        title: "Blog 3",
        author: "Author 3",
        url: "www.blog3.com",
        likes: 30,
        __v: 0
    },
    {
        _id: "5fea43b314f50326689f2ffa",
        title: "Blog 4",
        author: "Author 4",
        url: "www.blog4.com",
        likes: 40,
        __v: 0
    }
]

listWithZeroBlogs = []

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('ready-made list with multiple blogs', () => {
        const result = listHelper.totalLikes(readyMadeBlogList)
        expect(result).toBe(36)
    })

    test('db list with multiple blogs', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        expect(result).toBe(100)
    })

    test('empty list', () => {
        const result = listHelper.totalLikes(listWithZeroBlogs)
        expect(result).toBe(0)
    })
})

describe('favorite blog', () => {
    test('list has only one blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        const answer = {
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                likes: 5
        }
        expect(result).toEqual(answer)
    })

    test('ready-made list with multiple blogs', () => {
        const result = listHelper.favoriteBlog(readyMadeBlogList)
        const answer = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }
        expect(result).toEqual(answer)
    })

    test('db list with multiple blogs', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        const answer = {
            title: "Blog 4",
            author: "Author 4",
            likes: 40
        }
        expect(result).toEqual(answer)
    })

    test('empty list', () => {
        const result = listHelper.favoriteBlog(listWithZeroBlogs)
        expect(result).toBe(null)
    })
})

describe('most blogs', () => {
    test('list has only one blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        const answer = {
                author: 'Edsger W. Dijkstra',
                blogs: 1
        }
        expect(result).toEqual(answer)
    })

    test('ready-made list with multiple blogs', () => {
        const result = listHelper.mostBlogs(readyMadeBlogList)
        const answer = {
            author: "Robert C. Martin",
            blogs: 3
        }
        expect(result).toEqual(answer)
    })

    test('db list with multiple blogs', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs)
        const answer = {
            author: "Author 1",
            blogs: 1
        }
        expect(result).toEqual(answer)
    })

    test('empty list', () => {
        const result = listHelper.mostBlogs(listWithZeroBlogs)
        expect(result).toBe(null)
    })
})

describe('most likes', () => {
    test('list has only one blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        const answer = {
                author: 'Edsger W. Dijkstra',
                likes: 5
        }
        expect(result).toEqual(answer)
    })
    
    test('ready-made list with multiple blogs', () => {
        const result = listHelper.mostLikes(readyMadeBlogList)
        const answer = {
            author: "Edsger W. Dijkstra",
            likes: 17
        }
        expect(result).toEqual(answer)
    })
    
    test('db list with multiple blogs', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        const answer = {
            author: "Author 4",
            likes: 40
        }
        expect(result).toEqual(answer)
    })

    test('empty list', () => {
        const result = listHelper.mostLikes(listWithZeroBlogs)
        expect(result).toBe(null)
    }) 
})