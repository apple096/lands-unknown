import {Npc} from "@/ig-template/features/npcs/Npc";
import {Saveable} from "@/ig-template/tools/saving/Saveable";
import {NpcSaveData} from "@/ig-template/features/npcs/NpcSaveData";
import {NpcId} from "@/ig-template/features/npcs/NpcId";

/**
 * In case your Npc needs to save some data
 */
export abstract class SaveableNpc extends Npc implements Saveable {

    saveKey: string;

    constructor(id: NpcId, saveKey: string) {
        super(id);
        this.saveKey = saveKey;
    }

    abstract save(): NpcSaveData;

    abstract load(data: NpcSaveData): void;
}
