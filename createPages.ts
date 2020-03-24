import * as path from "path";

export default async ({ graphql, actions }) => {
    const { createPage } = actions;
    const result = await graphql(`
    query {
      allStar {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
      allPlanet {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  result.data.allStar.edges.forEach(({ node }) => {
    createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/StarInfo.tsx`),
        context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug
        }
    });
});
result.data.allPlanet.edges.forEach(({ node }) => {
  createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/PlanetInfo.tsx`),
      context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: node.fields.slug
      }
  });
});
}