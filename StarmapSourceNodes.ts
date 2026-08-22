import { default as Starmap } from './src/lib/Starmap'
import { getSystemInfo } from './src/lib/nivEngine'

export default async ({ actions }) => {
    const { createNode } = actions;
    Starmap.stars.forEach(star => {
        if (star.name === "" || star.name === undefined || star === undefined) return;
        const system = getSystemInfo(star.x, star.y, star.z);
        const children = [];

        const starPlanets = Starmap.getPlanetsForStar(star.name);

        // Map each planet record to its 0-based body index (starmap indices are
        // 1-based) so we can resolve a moon's parent planet name.
        const byBodyIndex: { [i: number]: any } = {};
        starPlanets.forEach(planet => {
            const bodyIndex = parseInt(planet.index, 10) - 1;
            if (!isNaN(bodyIndex)) byBodyIndex[bodyIndex] = planet;
        });

        starPlanets.forEach(planet => {
            if (planet.name === "") return
            const id = `planet_${planet.name}`
            children.push(id);
            const planetChildren = [];

            const bodyIndex = parseInt(planet.index, 10) - 1;
            const body = !isNaN(bodyIndex) ? system.bodies[bodyIndex] : undefined;
            const isMoon = body ? body.isMoon : false;
            const ownerIndex = body && body.isMoon ? body.owner : null;
            const moonId = body && body.isMoon ? body.moonId : null;
            const ownerName =
                ownerIndex !== null && byBodyIndex[ownerIndex]
                    ? byBodyIndex[ownerIndex].name
                    : null;

            Starmap.getGuideEntriesForPlanetByName(planet.name).forEach((entry, index) => {
                const id = `guide_${entry.object_id}_${index}`
                planetChildren.push(id);
                createNode({
                    id,
                    data: entry,
                    internal: {
                        type: "GuideEntry",
                        contentDigest: JSON.stringify(entry),
                    },
                })
            });

            createNode({
                id,
                data: planet,
                isMoon,
                ownerIndex,
                moonId,
                ownerName,
                internal: {
                    type: "Planet",
                    contentDigest:
                        JSON.stringify(planet) +
                        JSON.stringify({ isMoon, ownerIndex, moonId, ownerName }),
                },
                children: planetChildren
            })
        })

        Starmap.getGuideEntriesForStar(star.name).forEach((entry, index) => {
            const id = `guide_${entry.object_id}_${index}`
            children.push(id);
            createNode({
                id,
                data: entry,
                internal: {
                    type: "GuideEntry",
                    contentDigest: JSON.stringify(entry),
                },
            })
        });

        createNode({
            id: `star_${star.name}`,
            systemInfo: system,
            data: star,
            internal: {
                type: "Star",
                contentDigest: JSON.stringify(star) + JSON.stringify(system)
            },
            children
        });
    });

    return;
};