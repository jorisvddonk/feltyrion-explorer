require("ts-node").register({ files: true });
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
    title: `Feltyrion Explorer`
  },
  plugins: [`gatsby-plugin-react-helmet`, `gatsby-plugin-typescript`]
};
