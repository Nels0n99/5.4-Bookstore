const {Book, Author, AuthorBooks} = require('../models')

//view all
module.exports.viewAll = async function (req, res){
    const books = await Book.findAll();
    res.render('book/view_all', {books});
}

//profile
module.exports.viewProfile = async function(req, res){
    const book = await Book.findByPk(req.params.id, {
        include: 'authors'
    });
    const authors = await Author.findAll();
    let availableAuthors = [];
    for (let i=0; i<authors.length; i++){
        if (!bookHasAuthor(book, authors[i])){
            availableAuthors.push(authors[i])
        }
    }
    res.render('book/profile', {book, availableAuthors})
}

//render add form
module.exports.renderAddForm = function (req, res){
    const book = {
        title: '',
        author: '',
        author2: '',
        author3: '',
        publisher: '',
        genre: '',
        page_numbers: '',
        image_cover: '',
        description: ''
    }
    res.render('book/add', {book})
}

//add
module.exports.addBook = async function (req, res){
    const book = await Book.create({
        title: req.body.title,
        author: req.body.author,
        author2: req.body.author2,
        author3: req.body.author3,
        publisher: req.body.publisher,
        genre: req.body.genre,
        page_numbers: req.body.page_numbers,
        image_cover: req.body.image_cover,
        description: req.body.description
    });
    res.redirect(`/books/profile/${book.id}`);
}

//render edit form
module.exports.renderEditForm = async function (req,res){
    const book = await Book.findByPk(req.params.id);
    res.render('book/edit', {book});
}

//update
module.exports.updateBook = async function (req, res){
    const book = await Book.update({
        title: req.body.title,
        author: req.body.author,
        author2: req.body.author2,
        author3: req.body.author3,
        publisher: req.body.publisher,
        genre: req.body.genre,
        page_numbers: req.body.page_numbers,
        image_cover: req.body.image_cover,
        description: req.body.description
        }, {
        where: {
            id: req.params.id
        }
        });
    res.redirect(`/books/profile/${req.params.id}`);
}

//delete
module.exports.deleteBook = async function (req, res){
    await Book.destroy({
        where: {
            id: req.params.id
        }
        });
    res.redirect('/books')
}

//Add student to a course
module.exports.applyAuthor = async function (req, res){
    await AuthorBooks.create({
        author_id: req.body.author,
        book_id: req.params.bookId
    });
    res.redirect(`/books/profile/${req.params.bookId}`)
}

//remove an author from a book
module.exports.removeAuthor = async function (req, res){
    await AuthorBooks.destroy({
        where: {
            book_id: req.params.bookId,
            author_id: req.params.authorId
        }
    });
    res.redirect(`/books/profile/${req.params.bookId}`)
}

function bookHasAuthor(book, author){
    for (let i=0; i<book.authors.length; i++){
        if (author.id === book.authors[i].id) {
            return true
        }
    }
    return false
}