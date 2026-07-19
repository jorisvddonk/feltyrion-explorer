const fs = require("fs");
const path = require("path");
const starmapSourceNodes = require("./StarmapSourceNodes").default;
const sanitizeFilename = require("sanitize-filename");
const { buildStarText, buildPlanetText, buildLlmsTxt, buildIndexText } = require("./src/lib/plainText");

exports.sourceNodes = async opts => {
  await starmapSourceNodes(opts);
  return;
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `Star`) {
    const name = sanitizeFilename(node.data.name);
    const slug = `/stars/${name}`;
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }

  if (node.internal.type === `Planet`) {
    const name = sanitizeFilename(node.data.name);
    const slug = `/planets/${name}`;
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }
};

exports.createPages = require("./createPages").default;

exports.onPostBuild = async ({ graphql }) => {
  const result = await graphql(`
    {
      allStar {
        nodes {
          data {
            name
            type
            x
            y
            z
          }
          fields {
            slug
          }
          systemInfo {
            nop
            nob
            bodies {
              index
              isMoon
              owner
              moonId
              type
              symbol
              code
            }
          }
          childrenGuideEntry {
            data {
              text
            }
          }
          childrenPlanet {
            id
            data {
              name
              index
            }
            fields {
              slug
            }
          }
        }
      }
      allPlanet {
        nodes {
          data {
            name
            index
            x
            y
            z
          }
          fields {
            slug
          }
          childrenGuideEntry {
            data {
              text
            }
          }
        }
      }
    }
  `);

  const publicDir = path.resolve(__dirname, "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const writeFile = (relPath, contents) => {
    const full = path.join(publicDir, relPath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, contents);
  };

  result.data.allStar.nodes.forEach(star => {
    writeFile(`${star.fields.slug}.txt`, buildStarText(star));
  });

  result.data.allPlanet.nodes.forEach(planet => {
    writeFile(`${planet.fields.slug}.txt`, buildPlanetText(planet));
  });

  writeFile(
    `/llms.txt`,
    buildLlmsTxt(result.data.allStar, result.data.allPlanet)
  );

  writeFile(`/index.txt`, buildIndexText(result.data.allStar));

  console.log(
    `onPostBuild: wrote ${result.data.allStar.nodes.length} star .txt files, ` +
      `${result.data.allPlanet.nodes.length} planet .txt files, /llms.txt, and /index.txt`
  );
};
