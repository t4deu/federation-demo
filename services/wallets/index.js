const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  extend type Query {
    wallet(id: ID!): Wallet
  }

  type Wallet @key(fields: "id") {
    id: ID!
    name: String
    balance: Int
  }
`;

const resolvers = {
  Wallet: {
    __resolveReference(object) {
      return wallets.find((wallet) => wallet.id === object.id);
    },
  },
  Query: {
    wallet(_, { id }) {
      return wallets.find((wallet) => wallet.id === id);
    },
  },
};

const wallets = [
  {
    id: 'rappy',
    balance: 899,
    name: 'Rappy',
  },
  {
    id: 'payments',
    balance: 1299,
    name: 'Pagamentos',
  },
  {
    id: 'transfers',
    balance: 54,
    name: 'Transferencias',
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

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
