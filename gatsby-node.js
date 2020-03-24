const starmapSourceNodes = require("./StarmapSourceNodes").default;
const sanitizeFilename = require('sanitize-filename');

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
