import {RoadLocationIdentifier} from "@/ig-template/features/world-map/roads/RoadLocationIdentifier";
import {WorldLocationIdentifier} from "@/ig-template/features/world-map/WorldLocationIdentifier";
import {NoRequirement} from "@/ig-template/tools/requirements/NoRequirement";
import {Requirement} from "@/ig-template/tools/requirements/Requirement";
import {WorldLocation} from "@/ig-template/features/world-map/WorldLocation";
import {WorldPosition} from "@/ig-template/tools/tiled/WorldPosition";

export class Road extends WorldLocation {
    from: WorldLocationIdentifier;
    to: WorldLocationIdentifier;
    baseDifficulty: number;

    points: WorldPosition[];

    constructor(identifier: RoadLocationIdentifier, displayName: string, from: WorldLocationIdentifier, to: WorldLocationIdentifier, points: WorldPosition[], baseDifficulty: number, requirement: Requirement = new NoRequirement()) {
        super(identifier, displayName, requirement);
        this.from = from;
        this.to = to;
        this.points = points;
        this.baseDifficulty = baseDifficulty;
    }

    getWorldPosition(progress: number): WorldPosition {
        progress = Math.min(0.999, Math.max(0, progress));
        const startIndex = Math.floor(progress * this.points.length)
        return this.points[startIndex];
    }
}
