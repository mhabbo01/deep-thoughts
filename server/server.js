const express = require('express');
// import apollo
const { ApolloServer } = require('apollo-server-express');
// import typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create new apollo server and pass it our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create a new instance of an Apollo server with graphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our apollo server with the express application as middleware
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      //log where we can go twst our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer(typeDefs, resolvers);
