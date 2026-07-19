// Plain-text rendering of star/planet data, shared by the build-time
// static .txt file generator (onPostBuild) and consumed by LLMs.

const PLANET_SYMBOLS = ['^', 'd', 'k', 'f', 'r', 'n', '@', 'i', 'q', '+', '*'];
const PLANET_CODES = [
  'unstable',
  'dusty, craterized',
  'thick atmosphere',
  'felisian',
  'rocky, creased',
  'thin atmosphere',
  'large, not consistent',
  'icy surface',
  'quartz surface',
  'substellar object',
  'companion star'
];

export function buildStarText(star: any): string {
  const bodies = star.systemInfo.bodies || [];
  const planets = bodies.filter(b => !b.isMoon);
  const moonsOf = owner => bodies.filter(b => b.isMoon && b.owner === owner);

  const namedByIndex: { [i: number]: any } = {};
  (star.childrenPlanet || []).forEach(p => {
    const i = parseInt(p.data.index, 10) - 1;
    if (!isNaN(i)) namedByIndex[i] = p;
  });

  const nameOf = (body: any) => {
    const named = namedByIndex[body.index];
    if (named) return named.data.name;
    return body.isMoon ? `Moon #${body.moonId}` : `Planet #${body.index}`;
  };
  const typeOf = (body: any) => `${body.symbol} ${body.code}`;

  const lines: string[] = [];
  lines.push(`Star: ${star.data.name}`);
  lines.push(`Star class: S${star.data.type}`);
  lines.push(
    `Paris coordinates: ${star.data.x}, ${-star.data.y}, ${star.data.z}`
  );
  lines.push(
    `Bodies: ${bodies.length} (${planets.length} planets, ${
      bodies.length - planets.length
    } moons)`
  );
  lines.push("");
  lines.push("System:");
  planets.forEach(planet => {
    const moons = moonsOf(planet.index);
    lines.push(`- ${nameOf(planet)} (${typeOf(planet)})`);
    moons.forEach(moon => {
      lines.push(`  - ${nameOf(moon)} (${typeOf(moon)})`);
    });
  });

  const guide = (star.childrenGuideEntry || [])
    .map(e => e.data.text)
    .filter(Boolean);
  if (guide.length) {
    lines.push("");
    lines.push("Guide entries:");
    guide.forEach(text => lines.push(text));
  }

  return lines.join("\n") + "\n";
}

export function buildPlanetText(planet: any): string {
  const lines: string[] = [];
  lines.push(`Planet: ${planet.data.name}`);
  lines.push(`Starmap index: ${planet.data.index}`);
  lines.push(
    `Paris coordinates: ${planet.data.x}, ${-planet.data.y}, ${planet.data.z}`
  );

  const guide = (planet.childrenGuideEntry || [])
    .map(e => e.data.text)
    .filter(Boolean);
  if (guide.length) {
    lines.push("");
    lines.push("Guide entries:");
    guide.forEach(text => lines.push(text));
  }

  return lines.join("\n") + "\n";
}

export function buildLlmsTxt(allStar: any, allPlanet: any): string {
  const stars = allStar.nodes
    .slice()
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
  const planets = allPlanet.nodes
    .slice()
    .sort((a, b) => a.data.name.localeCompare(b.data.name));

  const PREFIX = "/feltyrion-explorer";

  const starLines = stars.map(
    n =>
      `- [${n.data.name}](${PREFIX}${n.fields.slug}.txt): S${n.data.type} — ${
        n.systemInfo.nob
      } bodies (${n.systemInfo.nop} planets, ${
        n.systemInfo.nob - n.systemInfo.nop
      } moons)`
  );
  const planetLines = planets.map(
    n => `- [${n.data.name}](${PREFIX}${n.fields.slug}.txt)`
  );

  const lines: string[] = [];
  lines.push("# Feltyrion Explorer");
  lines.push("");
  lines.push(
    "A browsable and machine-readable atlas of the Noctis IV (Feltyrion) galaxy."
  );
  lines.push(
    "Data is derived from the Noctis starmap binary (named stars, planets, and guide"
  );
  lines.push(
    "entries) combined with a procedural re-implementation of the Noctis IV engine"
  );
  lines.push(
    "(niv_engine) that deterministically derives each star's planets and"
  );
  lines.push("moons from its Paris coordinates.");
  lines.push("");
  lines.push("## How to read this site");
  lines.push("");
  lines.push("- Every star has an HTML page at /stars/<name> and a plain-text");
  lines.push("  equivalent at /stars/<name>.txt (recommended for LLMs).");
  lines.push("- Every named planet has an HTML page at /planets/<name> and a");
  lines.push("  plain-text equivalent at /planets/<name>.txt.");
  lines.push("- Plain-text pages use a simple, predictable format: header lines,");
  lines.push("  a `System:` section listing planets (`-`) and their moons");
  lines.push("  (indented `  -`), and any `Guide entries:`.");
  lines.push("");
  lines.push("## Data fields");
  lines.push("");
  lines.push(
    "- Star class (`S<type>`): an integer 0-11 from the procedural engine,"
  );
  lines.push("  loosely corresponding to a stellar class.");
  lines.push(
    "- Paris coordinates: 3 integers (x, y, z) in the Noctis coordinate"
  );
  lines.push("  system. Note the y axis is negated when displayed.");
  lines.push(
    "- Bodies / planets / moons: counts come from the engine. The first"
  );
  lines.push(
    "  N bodies (N = planet count) are planets; all later bodies are moons"
  );
  lines.push(
    "  of a preceding planet (indicated by their owner index)."
  );
  lines.push(
    "- Body type: written as `<symbol> <code>`, e.g. `d dusty, craterized`."
  );
  lines.push(
    "  Symbols: ^ unstable, d dusty/craterized, k thick atmosphere, f"
  );
  lines.push(
    "  felisian, r rocky/creased, n thin atmosphere, @ large/not consistent,"
  );
  lines.push(
    "  i icy surface, q quartz surface, + substellar object, * companion star."
  );
  lines.push(
    "- Guide entries: flavor/description text authored for the object in"
  );
  lines.push("  the original Noctis game.");
  lines.push("");
  lines.push("## Companion files");
  lines.push("");
  lines.push(
    "- /index.txt: a plain-text listing of every star (name, class, body"
  );
  lines.push("  counts) with links to each star's .txt page.");
  lines.push(
    "- /stars/<name>.txt and /planets/<name>.txt: per-object plain-text pages."
  );

  return lines.join("\n") + "\n";
}

export function buildIndexText(allStar: any): string {
  const PREFIX = "/feltyrion-explorer";
  const stars = allStar.nodes
    .slice()
    .sort((a, b) => a.data.name.localeCompare(b.data.name));

  const lines: string[] = [];
  lines.push("# Feltyrion Explorer — star index");
  lines.push("");
  lines.push(
    `Total stars: ${stars.length}. Each star has an HTML page at /stars/<name>`
  );
  lines.push(
    "and a plain-text page at /stars/<name>.txt. See /llms.txt for the full"
  );
  lines.push("index and a description of all data fields.");
  lines.push("");
  stars.forEach(n => {
    lines.push(
      `- [${n.data.name}](${PREFIX}${n.fields.slug}.txt): S${n.data.type} — ${
        n.systemInfo.nob
      } bodies (${n.systemInfo.nop} planets, ${
        n.systemInfo.nob - n.systemInfo.nop
      } moons)`
    );
  });

  return lines.join("\n") + "\n";
}
