const starmapSourceNodes = require("./StarmapSourceNodes").default;

exports.sourceNodes = async opts => {
  await starmapSourceNodes(opts);
  return;
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `Star`) {
    const slug = `/stars/${node.data.name}`;
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }

  if (node.internal.type === `Planet`) {
    const slug = `/planets/${node.data.name}`;
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }
};

exports.createPages = require("./createPages").default;
