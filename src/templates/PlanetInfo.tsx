import * as React from "react";
import { DefaultLayout as Layout } from "../layouts/index";
import { graphql } from "gatsby";

export default function PlanetInfo({ data }) {
  const { planet } = data;
  return (
    <Layout>
      <h1>{planet.data.name}</h1>
      <p>
        planet with index <em>{planet.data.index}</em> at {planet.data.x}, {-planet.data.y},{" "}
        {planet.data.z}
      </p>

      <h2>Guide entries</h2>
      <pre>
        {planet.childrenGuideEntry.map(entry => entry.data.text).join("\n")}
      </pre>
    </Layout>
  );
}
export const query = graphql`
  query($slug: String!) {
    planet(fields: { slug: { eq: $slug } }) {
      id
      data {
        name
        index
        x
        y
        z
      }
      childrenGuideEntry {
        data {
          text
        }
      }
    }
  }
`;
