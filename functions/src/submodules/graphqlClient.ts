import { GraphQLClient } from 'graphql-request'

let graphqlUri = `${process.env.API_PROTOCOL}://${process.env.API_DOMAIN}`

if (process.env.API_PORT) {
  graphqlUri += `:${process.env.API_PORT}`
}

if (process.env.GRAPHQL_PATH) {
  graphqlUri += process.env.GRAPHQL_PATH
}

export const client = new GraphQLClient(graphqlUri);
