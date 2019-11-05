const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  extend type Query {
    user: User
  }

  extend type Mutation {
    user: UserActions
  }

  type User @key(fields: "uid") @key(fields: "company") {
    uid: ID!
    name: String
    company: String!
  }

  type UserActions {
    updateName(input: UpdateNameInput): User
  }

  input UpdateNameInput {
    name: String!
  }
`;

const resolvers = {
  Query: {
    user() {
      return users[0];
    },
  },
  Mutation: {
    user() {
      return users[0];
    },
  },
  User: {
    __resolveReference(object) {
      return users.find((user) => user.uid === object.uid);
    },
  },
  UserActions: {
    updateName(user, {input}) {
      return {
        ...user,
        ...input,
      }
    }
  }
};

const users = [
  {
    uid: '1',
    name: 'Ada Lovelace',
    company: '17667787000142',
  },
  {
    uid: '2',
    name: 'Alan Turing',
    company: '81193162000195',
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

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
