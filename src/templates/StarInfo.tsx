import * as React from "react";
import { DefaultLayout as Layout } from "../layouts/index";
import Link from "gatsby-link";
import { graphql } from "gatsby";

export default function StarInfo({ data }) {
  const { star } = data;
  return (
    <Layout>
      <h1>{star.data.name}</h1>
      <p>
        Star of type <em>S{star.data.type}</em> at {star.data.x}, {star.data.y},{" "}
        {star.data.z}
      </p>
      <h2>Planets</h2>
      <div>
        {star.childrenPlanet.map(planet => {
          return (
            <div key={planet.id}>
              <span>
                <em><Link to={planet.fields.slug}>{planet.data.name}</Link> (index {planet.data.index})</em>
              </span>
            </div>
          );
        })}
      </div>

      <h2>Guide entries</h2>
      <pre>
        {star.childrenGuideEntry.map(entry => entry.data.text).join("\n")}
      </pre>
    </Layout>
  );
}
export const query = graphql`
  query($slug: String!) {
    star(fields: { slug: { eq: $slug } }) {
      id
      data {
        name
        type
        x
        y
        z
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
          x
          y
          z
        }
        fields {
          slug
        }
      }
    }
  }
`;
