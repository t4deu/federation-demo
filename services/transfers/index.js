const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  type Transfer @key(fields: "id") {
    id: ID!
    username: User @provides(fields: "name")
    walletId: ID!
    company: String!
    status: String
    value: Int
  }

  extend type User @key(fields: "company") {
    company: String! @external
    name: String @external
    transfers: [Transfer]
  }

  extend type Wallet @key(fields: "id") {
    id: ID! @external
    transfers: [Transfer]
  }
`;

const resolvers = {
  Transfer: {
    username(transfer) {
      return { __typename: 'User', company: transfer.company };
    },
  },
  User: {
    transfers(user) {
      return transfers.filter((transfer) => transfer.company === user.company);
    },
    numberOfTransfers(user) {
      return transfers.filter((transfer) => transfer.company === user.company)
        .length;
    },
    username(user) {
      const found = usernames.find(
        (username) => username.company === user.company
      );
      return found ? found.username : null;
    },
  },
  Wallet: {
    transfers(wallet) {
      return transfers.filter((transfer) => transfer.walletId === wallet.id);
    },
  },
};

const transfers = [
  {
    id: '1',
    walletId: 'transfers',
    company: '17667787000142',
    status: 'pending',
    value: 875,
  },
  {
    id: '2',
    walletId: 'transfers',
    company: '17667787000142',
    status: 'done',
    value: 490,
  },
  {
    id: '3',
    walletId: 'transfers',
    company: '17667787000142',
    status: 'requested',
    value: 1000,
  },
  {
    id: '4',
    walletId: 'transfers',
    company: '81193162000195',
    status: 'pending',
    value: 6500,
  },
];

const usernames = [
  { company: '1', username: 'Ada Lovelace' },
  { company: '2', username: 'Alan Turing' },
];

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
