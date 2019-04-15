var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
const cors = require('cors')

console.log("hi")
var pg = require('pg')
var conString = "postgres://prodigyadmin:xxxxxx@localhost:8080/apollo";
var client = new pg.Client(conString);
client.connect();

// GraphQL schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        loans(thing: Int): [Loan]
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    },
    type Loan {
        applicationid: Int
        userid: Int
    },
`);
var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]
var getCourse = function(args) {
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}
var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}
var getLoans = function(args) {
    // return [{applicationId: 1, userId: 1}
  rows = client.query("select application_id as applicationid, user_id as userid from dw.rpt_loantape limit 10")
    .then(res => res.rows)
  return rows
}
var root = {
    course: getCourse,
    courses: getCourses,
    loans: getLoans,
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use(cors())
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));