const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Marker {
    _id: String!
    name: String!
    comment: String!
    image: String!
    lat: Float!
    lng: Float!
    isDescriptionActive: Boolean!
    isMarkerActive: Boolean!
    date: String!
  }

  input NewMarkerInfo {
    name: String!
    comment: String!
    image: String!
    lat: Float!
    lng: Float!
  }

  type RootQuery {
    getAllMarkers: [Marker!]!
  }

  type RootMutation {
    createNewPlace(inputs: NewMarkerInfo): Marker!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
