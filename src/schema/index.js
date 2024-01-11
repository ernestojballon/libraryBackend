import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID ,GraphQLList,GraphQLInt,GraphQLNonNull} from 'graphql';
import _ from 'lodash';
import Book from '../models/book.js';
import Author from '../models/authors.js';

// Build book type
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: ()=>({
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    id: { type: GraphQLID },
    author: {
      type: AuthorType,
      resolve(parent, args){
        console.log(parent);
        return _.find(authors, {id: parent.authorId });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields:()=>( {
    name: { type: GraphQLString },
    age: { type: GraphQLString },
    id: { type: GraphQLID },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
          return _.filter(books, { authorId: parent.id });
      }
    }})
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {id: { type: GraphQLID }},
      resolve(parent, args){
        return Book.findById(args.id);
      }

    },
    author: {
      type: AuthorType,
      args: {id: { type: GraphQLID }},
      resolve(parent, args){
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
          return Book.find({});
      }
    },
    authors: {
        type: new GraphQLList(AuthorType),
        resolve(parent, args){
            return Author.find({});
        }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
      addAuthor: {
          type: AuthorType,
          args: {
              name: { type: GraphQLString },
              age: { type: GraphQLInt }
          },
          resolve(parent, args){
              let author = new Author({
                  name: args.name,
                  age: args.age
              });
              return author.save();
          }
      },
      addBook: {
          type: BookType,
          args: {
              title: { type: new GraphQLNonNull(GraphQLString) },
              genre: { type: new GraphQLNonNull(GraphQLString) },
              authorId: { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve(parent, args){
              let book = new Book({
                  title: args.title,
                  genre: args.genre,
                  authorId: args.authorId
              });
              return book.save();
          }
      }
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

