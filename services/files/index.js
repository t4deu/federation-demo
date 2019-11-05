const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  extend type User @key(fields: "uid") {
    uid: ID! @external
    company: String! @external
    selfUrl: String @requires(fields: "company")
  }
`;

const resolvers = {
  User: {
    selfUrl(user) {
      const file = selfs.find(self => self.userUid === user.uid);
      return `selfs/${user.company}/${file.url}?signedkey`;
    },
  },
};

const selfs = [
  {
    userUid: '1',
    url: 'file.jpg',
  },
  {
    userUid: '2',
    url: 'file2.jpg',
  },
];

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4004 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
