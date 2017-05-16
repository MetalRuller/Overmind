import {Task} from "./Task";

type targetType = StructureWall | Rampart;
export class taskFortify extends Task {
    target: targetType;

    constructor(target: targetType) {
        super('fortify', target);
        // Settings
        this.maxPerTarget = 1;
        this.targetRange = 3;
        this.moveColor = 'green';
    }

    isValidTask() {
        return (this.creep.carry.energy > 0);
    }

    isValidTarget() {
        let target = this.target;
        let maxHP = this.creep.colony.overlord.settings.fortifyLevel;
        return (target != null && target.hits < 1.2 * maxHP); // over-fortify to minimize extra trips
    }

    work() {
        return this.creep.repair(this.target);
    }
}