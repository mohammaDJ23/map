const { graphqlHTTP } = require("express-graphql");

const graphQlSchema = require("../graphql/schema");
const graphQlResolver = require("../graphql/resolver");

module.exports = graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolver,
  graphiql: true,

  customFormatErrorFn(err) {
    if (!err.originalError) {
      return err;
    }

    const { data, code = 500, message = "an error occure" } = err.originalError;
    return { data, status: code, message };
  }
});
