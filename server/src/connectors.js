import mongoose from 'mongoose';
import casual from 'casual';
import _ from 'lodash';

const MONGO_DB = process.env.MONGO_DB;
mongoose.connect(MONGO_DB);
mongoose.Promise = global.Promise;
console.log('MONGO_DB', MONGO_DB);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DB is connected!');
});

const authorSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
});

const postSchema = mongoose.Schema({
  authorId: String,
  title: String,
  text: String,
});

const Author = mongoose.model('Author', authorSchema);
const Post = mongoose.model('Post', postSchema);

casual.seed(11);
// db.sync({ force: true }).then(() => {
  _.times(10, () => (
    new Author({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).save().then(author => (
      new Post({
        authorId: author._id, // eslint-disable-line
        title: `A post by ${author.firstName}`,
        text: casual.sentences(3),
      }).save()
    ))
  ));
// });

export { Author, Post };