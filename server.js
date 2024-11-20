const express = require("express");
const app = express();
const PORT = 5000;
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLString } = graphql;
const { graphqlHTTP } = require("express-graphql");

// Serve static files from the 'public' folder
app.use(express.static("public"));

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return userData;
      },
    },
    findUserById: {
      type: UserType,
      description: "fetch single user",
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return userData.find((a) => a.id == args.id);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newUser = {
          id: userData.length + 1,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          password: args.password,
        };
        userData.push(newUser);
        return newUser;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.get("/rest/getUserById", (req, res) => {
  const userId = parseInt(req.query.id, 10); 
  const user = userData.find((user) => user.id === userId);

  if (user) {
    res.json(user); 
  } else {
    res.status(404).json({ message: "User not found" }); 
  }
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html"); 
});

app.get("/rest/getAllUsers", (req, res) => {
  res.json(userData); // Send data as JSON response
});

app.get("/users", (req, res) => {
  res.sendFile(__dirname + "/public/user-list.html"); // Ensure this path is correct
});

// Export app for testing
module.exports = app;
