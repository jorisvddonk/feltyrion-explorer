import { default as Starmap } from './src/lib/Starmap'
import { getSystemInfo } from './src/lib/nivEngine'

export default async ({ actions }) => {
    const { createNode } = actions;
    Starmap.stars.forEach(star => {
        if (star.name === "" || star.name === undefined || star === undefined) return;
        const system = getSystemInfo(star.x, star.y, star.z);
        const children = [];
        Starmap.getPlanetsForStar(star.name).forEach(planet => {
            if (planet.name === "") return
            const id = `planet_${planet.name}`
            children.push(id);
            const planetChildren = [];

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
                internal: {
                    type: "Planet",
                    contentDigest: JSON.stringify(planet),
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