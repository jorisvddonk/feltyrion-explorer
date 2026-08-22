import * as React from "react";
import { DefaultLayout as Layout } from "../layouts/index";
import { graphql } from "gatsby";

export default function PlanetInfo({ data }) {
  const { planet } = data;
  const isMoon = planet.isMoon;
  return (
    <Layout>
      <h1>{planet.data.name}</h1>
      <p>
        {isMoon ? "moon" : "planet"} with index <em>{planet.data.index}</em> at{" "}
        {planet.data.x}, {-planet.data.y}, {planet.data.z}
      </p>

      {isMoon && (
        <p>
          {planet.ownerName ? (
            <>
              moon of <a href={`/planets/${planet.ownerName}`}>{planet.ownerName}</a>{" "}
              (planet index {String(planet.ownerIndex + 1).padStart(2, "0")})
            </>
          ) : (
            <>moon of planet index {String(planet.ownerIndex + 1).padStart(2, "0")}</>
          )}
          {planet.moonId !== null && <> — moon #{planet.moonId}</>}
        </p>
      )}

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
      isMoon
      ownerIndex
      moonId
      ownerName
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
