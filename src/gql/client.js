import {GraphQLClient} from 'graphql-request';

const endpoint = 'https://api.teia.art/v1/graphql';

const gqlClient = new GraphQLClient(endpoint);

export default gqlClient;
