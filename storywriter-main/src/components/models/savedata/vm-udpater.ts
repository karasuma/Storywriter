import { StoryWrtiterViewModel } from "../../story-writer-viewmodel";
import { Stories } from "../story/stories";
import { StoryData } from "../story/story-data";
import { World } from "../world/worlds";
import { Country } from "../world/country";
import { MemoItem } from "../memo/memos";

export class ViewmodelUpdater {
    static Update(target: StoryWrtiterViewModel, newone: StoryWrtiterViewModel): void {
        // Hierarchy
        target.hierarchy.id = newone.hierarchy.id;
        target.hierarchy.content = new StoryData();
        target.hierarchy.content.caption = newone.hierarchy.content.caption;
        target.hierarchy.content.description = newone.hierarchy.content.description;
        target.hierarchy.content.color = newone.hierarchy.content.color;
        target.hierarchy.content.lores.splice(0);
        newone.hierarchy.content.lores.forEach(x => {
            target.hierarchy.content.appendLore(x);
        });
        target.hierarchy.isEditing = newone.hierarchy.isEditing;
        target.hierarchy.children.splice(0);
        newone.hierarchy.children.forEach(x => {
            target.hierarchy.appendStory(x);
        });

        // Dictionary
        target.dictionary.words.splice(0);
        newone.dictionary.words.forEach(x => target.dictionary.words.push(x));

        // Actors
        target.actors.actors.splice(0);
        newone.actors.actors.forEach(x => target.actors.actors.push(x));

        // Worlds
        target.worlds.worldGroups.splice(0);
        newone.worlds.worldGroups.forEach(x => {
            const newWorld = new World(x.name, target.worlds);
            newWorld.id = x.id;
            x.countries.forEach(y => {
                y.parent = newWorld;
                newWorld.countries.push(y);
            });
            target.worlds.appendWorld(newWorld);
        });

        // Memos
        target.memos.id = newone.memos.id;
        target.memos.memoList.splice(0);
        newone.memos.memoList.forEach(x => {
            const newMemo = new MemoItem(x.name, target.memos);
            newMemo.id = x.id;
            newMemo.color = x.color;
            newMemo.name = x.name;
            newMemo.text = x.text;
            target.memos.appendMemo(newMemo);
        });

        // Menu Index
        if(newone.menuIndex !== undefined) { // Deal with old version
            target.menuIndex = newone.menuIndex;
        }
    }
}