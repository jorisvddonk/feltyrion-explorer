import * as React from "react";
import { DefaultLayout as Layout } from "../layouts/index";
import Link from "gatsby-link";
import { graphql } from "gatsby";

export default function StarInfo({ data }) {
  const { star } = data;

  const bodies = star.systemInfo.bodies || [];
  const planets = bodies.filter(b => !b.isMoon);
  const moonsOf = owner =>
    bodies.filter(b => b.isMoon && b.owner === owner);

  // Overlay starmap names/links onto engine bodies by index.
  // Starmap `index` ("01".."29") parsed as integer I maps to engine body at
  // array index I - 1 (both count up from 1 and the engine has the same bodies).
  const namedByIndex: { [i: number]: any } = {};
  star.childrenPlanet.forEach(p => {
    const i = parseInt(p.data.index, 10) - 1;
    if (!isNaN(i)) namedByIndex[i] = p;
  });

  const label = (body: any) => {
    const named = namedByIndex[body.index];
    if (named) {
      return <Link to={named.fields.slug}>{named.data.name}</Link>;
    }
    return body.isMoon
      ? `Moon #${body.moonId}`
      : `Planet #${body.index}`;
  };

  const bodyLine = (body: any, prefix: string) => {
    const named = namedByIndex[body.index];
    const type = `${body.symbol} ${body.code}`;
    return (
      <div>
        {prefix}
        <Link to={named ? named.fields.slug : "#"}>
          {named ? named.data.name : label(body)}
        </Link>{" "}
        ({type})
      </div>
    );
  };

  return (
    <Layout>
      <h1>{star.data.name}</h1>
      <p>
        Star of type <em>S{star.data.type}</em> at {star.data.x}, {-star.data.y},{" "}
        {star.data.z}
      </p>
      <p>
        {bodies.length} bodies ({planets.length} planets,{" "}
        {bodies.length - planets.length} moons)
      </p>

      <h2>System</h2>
      <div>
        {planets.map(planet => {
          const moons = moonsOf(planet.index);
          return (
            <div key={planet.index}>
              {bodyLine(planet, "• ")}
              {moons.length > 0 && (
                <div style={{ marginLeft: "2em" }}>
                  {moons.map(moon => bodyLine(moon, "↳ "))}
                </div>
              )}
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
      systemInfo {
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
        }
        fields {
          slug
        }
      }
    }
  }
`;
