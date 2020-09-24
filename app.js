//import our necessary node modules
require("dotenv").config();
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cloudinary = require("cloudinary");
//get port from  process.env which is set to 4000
const { PORT } = process.env;

const app = express();

const typeDefs = gql`
  type Query {
    _: Boolean
  }
/*our mutation type for image upload which accepts the image location as a string whether local or remote.It returns a string.
*/
  type Mutation {
    uploadPhoto(photo: String): String
  }
`;
const resolvers = {
  Mutation: {
    uploadPhoto: async (_, { photo }) => {
      //initialize cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      /*
try-catch block for handling actual image upload
*/
      try {
        const result = await cloudinary.v2.uploader.upload(photo, {
          //here i chose to allow only jpg and png upload
          allowed_formats: ["jpg", "png"],
          //generates a new id for each uploaded image
          public_id: "",
          /*creates a folder called "your_folder_name" where images will be stored.
           */
          folder: "your_folder_name",
        });
      } catch (e) {
        //returns an error message on image upload failure.
        return `Image could not be uploaded:${e.message}`;
      }
      /*returns uploaded photo url if successful `result.url`.
if we were going to store image name in database,this
*/
      return `Successful-Photo URL: ${result.url}`;
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});
/*
Using Apollo Server’s applyMiddleware() method, you can opt-in any middleware, which in this case is Express.
*/
server.applyMiddleware({ app });

//starts listening on our port
app.listen(PORT, () => {
  console.log(
    `🚀 Apollo Server started on http://localhost:${PORT}${server.graphqlPath}`
  );
});
