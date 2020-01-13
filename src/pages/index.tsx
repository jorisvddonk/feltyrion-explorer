import * as React from "react";
import Link from "gatsby-link";
import DefaultLayout from "../layouts";
import { graphql } from "gatsby";
import { sortBy } from "lodash";

interface Props {
  data: {
    allStar: {
      nodes: any[];
    };
  };
}

export default class extends React.Component<Props, {}> {
  constructor(props: Props, context: any) {
    super(props, context);
  }
  public render() {
    return (
      <DefaultLayout>
        <h1>Star listing</h1>
        <ul>
          {sortBy(this.props.data.allStar.nodes, x => x.data.name).map(node => {
            return (
              <li key={node.id}>
                <Link to={node.fields.slug}>{node.data.name}</Link>
              </li>
            );
          })}
        </ul>
      </DefaultLayout>
    );
  }
}

export const pageQuery = graphql`
  query {
    allStar {
      nodes {
        id
        data {
          name
        }
        fields {
          slug
        }
      }
    }
  }
`;
