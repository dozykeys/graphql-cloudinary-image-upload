require("dotenv").config();
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cloudinary = require("cloudinary");

const { PORT } = process.env;
const app = express();

const typeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    uploadPhoto(photo: String): String
  }
`;
const resolvers = {
  Mutation: {
    uploadPhoto: async (_, { photo }) => {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      try {
        const result = await cloudinary.v2.uploader.upload(photo, {
          allowed_formats: ["jpg", "png", "gif", "jpeg", "svg", "bmp"],
          public_id: "",
          folder: "your_folder_name",
        });
      } catch (e) {
        return `Image could not be uploaded:${e.message}`;
      }

      return `Successful-Photo URL: ${result.url}`;
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(
    `🚀 Apollo Server started on http://localhost:${PORT}${server.graphqlPath}`
  );
});
