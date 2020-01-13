import * as React from "react";
import { DefaultLayout as Layout } from "../layouts/index";
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
                <em>{planet.data.name}</em> (index {planet.data.index})
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
      }
    }
  }
`;
