import { StoryWriterViewModel } from "../../story-writer-viewmodel";
import { ActorItem } from "../actor/actor-item";
import { Actors } from "../actor/actors";
import { Dictionary } from "../dictionary/dictionary";
import { Word } from "../dictionary/word";
import { MemoItem, Memos } from "../memo/memos";
import { Stories } from "../story/stories";
import { StoryData } from "../story/story-data";
import { StoryContent, StoryItem } from "../story/story-item";
import { ImageResource } from "../utils";
import { Country } from "../world/country";
import { World, Worlds } from "../world/worlds";

// Export classes -----
export class StoryWriterDAO {
    public hierarchy: StoriesDAO = new StoriesDAO();
    public dictionary: DictionaryDAO = new DictionaryDAO();
    public actors: ActorsDAO = new ActorsDAO();
    public worlds: WorldsDAO = new WorldsDAO();
    public memos: MemoDAO = new MemoDAO();
    public index = 0;
}

// Convert class
export class DAOConverter {
    static toDAO(viewmodel: StoryWriterViewModel): StoryWriterDAO {
        const dao = new StoryWriterDAO();
        dao.hierarchy = this.toHierarchyDAO(viewmodel.hierarchy);
        dao.dictionary = this.toDictionaryDAO(viewmodel.dictionary);
        dao.actors = this.toActorsDAO(viewmodel.actors);
        dao.worlds = this.toWorldsDAO(viewmodel.worlds);
        dao.memos = this.toMemoDAO(viewmodel.memos);
        dao.index = viewmodel.menuIndex;
        return dao;
    }

    static fromDAO(dao: StoryWriterDAO, targetvm: StoryWriterViewModel): void {
        targetvm.hierarchy = this.fromHierarchyDAO(dao.hierarchy);
        targetvm.dictionary = this.fromDictionaryDAO(dao.dictionary);
        targetvm.actors = this.fromActorsDAO(dao.actors);
        targetvm.worlds = this.fromWorldsDAO(dao.worlds);
        targetvm.memos = this.fromMemoDAO(dao.memos);
        targetvm.menuIndex = dao.index;
    }

    private static toHierarchyDAO(viewmodel: Stories): StoriesDAO {
        const toStoryItemDAO = (vm: StoryItem): StoryItemDAO => {
            const dao = new StoryItemDAO();
            dao.id = vm.id;
            dao.title = vm.title;
            dao.color = vm.color;
            vm.stories.forEach(x => {
                const pair = new TextWithID();
                pair.id = x.id;
                pair.content = x.text;
                dao.stories.push(pair);
            });
            return dao;
        };
        const toStoryDataDAO = (vm: StoryData): StoryDataDAO => {
            const dao = new StoryDataDAO();
            dao.caption = vm.caption;
            dao.description = vm.description;
            dao.color = vm.color;
            dao.time = vm.time;
            vm.lores.forEach(x => dao.lores.push(toStoryItemDAO(x)));
            return dao;
        };

        const dao = new StoriesDAO();
        dao.id = viewmodel.id;
        dao.editing = viewmodel.isEditing;
        dao.isdir = viewmodel.dirMode;
        dao.content = toStoryDataDAO(viewmodel.content);
        viewmodel.children.forEach(x => dao.children.push(DAOConverter.toHierarchyDAO(x)));
        dao.parentID = viewmodel.parent !== null ? viewmodel.parent.id : "";
        return dao;
    }
    private static fromHierarchyDAO(dao: StoriesDAO, parent: Stories | null = null): Stories {
        const fromStoryItemDAO = (dao: StoryItemDAO): StoryItem => {
            const item = new StoryItem();
            item.id = dao.id;
            item.title = dao.title;
            item.color = dao.color;
            dao.stories.forEach(x => {
                const newStory = new StoryContent();
                newStory.id = x.id;
                newStory.text = x.content;
                item.stories.push(newStory);
            });
            return item;
        };

        const fromStoryDataDAO = (dao: StoryDataDAO): StoryData => {
            const item = new StoryData();
            item.caption = dao.caption;
            item.description = dao.description;
            item.color = dao.color;
            item.time = dao.time;
            dao.lores.forEach(x => item.lores.push(fromStoryItemDAO(x)));
            return item;
        };
        
        const depth = parent !== null ? parent.currentDepth : -1;
        const root = parent !== null ? parent.root : null;
        const stories = new Stories(dao.isdir, "", depth + 1, root);
        stories.id = dao.id;
        stories.isEditing = dao.editing;
        stories.content = fromStoryDataDAO(dao.content);
        dao.children.forEach(x => stories.children.push(DAOConverter.fromHierarchyDAO(x, stories)));
        if(parent !== null) {
            stories.parent = parent;
        }
        return stories;
    }

    private static toDictionaryDAO(viewmodel: Dictionary): DictionaryDAO {
        const toWordDAO = (vm: Word): WordDAO => {
            const dao = new WordDAO();
            dao.id = vm.id;
            dao.editing = vm.editing;
            dao.caption = vm.caption;
            dao.description = vm.description;
            vm.resources.forEach(x => {
                const pair = new TextWithID();
                pair.id = x.id;
                pair.content = x.content;
                dao.resources.push(pair);
            })
            return dao;
        };

        const dao = new DictionaryDAO();
        viewmodel.words.forEach(x => dao.words.push(toWordDAO(x)));
        return dao;
    }
    private static fromDictionaryDAO(dao: DictionaryDAO): Dictionary {
        const fromWordDAO = (dao: WordDAO): Word => {
            const word = new Word();
            word.id = dao.id;
            word.editing = dao.editing;
            word.caption = dao.caption;
            word.description = dao.description;
            dao.resources.forEach(x => {
                const pair = new TextWithID();
                pair.id = x.id;
                pair.content = x.content;
                word.resources.push(pair);
            });
            return word;
        };

        const dictionary = new Dictionary();
        dao.words.forEach(x => dictionary.words.push(fromWordDAO(x)));
        return dictionary;
    }

    private static toActorsDAO(viewmodel: Actors): ActorsDAO {
        const toActorItemDAO = (vm: ActorItem): ActorItemDAO => {
            const dao = new ActorItemDAO();
            dao.id = vm.id;
            dao.name = vm.name;
            dao.face.id = vm.face.id;
            dao.face.content = vm.face.content;
            dao.introduce = vm.introduce;
            dao.detail = vm.detail;
            vm.images.forEach(x => {
                const pair = new TextWithID();
                pair.id = x.id;
                pair.content = x.content;
                dao.images.push(pair);
            });
            return dao;
        };

        const dao = new ActorsDAO();
        viewmodel.actors.forEach(x => dao.actors.push(toActorItemDAO(x)));
        return dao;
    }
    private static fromActorsDAO(dao: ActorsDAO): Actors {
        const fromActorItemDAO = (dao: ActorItemDAO): ActorItem => {
            const item = new ActorItem();
            item.id = dao.id;
            item.name = dao.name;
            item.face.id = dao.face.id;
            item.face.content = dao.face.content;
            item.introduce = dao.introduce;
            item.detail = dao.detail;
            dao.images.forEach(x => {
                const imgr = new ImageResource(x.content);
                imgr.id = x.id;
                item.images.push(imgr);
            });
            return item;
        };
        
        const actors = new Actors();
        dao.actors.forEach(x => actors.actors.push(fromActorItemDAO(x)));
        return actors;
    }

    private static toWorldsDAO(viewmodel: Worlds): WorldsDAO {
        const toCountryDAO = (vm: Country): CountryDAO => {
            const dao = new CountryDAO();
            dao.id = vm.id;
            dao.name = vm.name;
            dao.description = vm.description;
            dao.editing = vm.editing;
            dao.image.id = vm.image.id;
            dao.image.content = vm.image.content;
            vm.samples.forEach(x => {
                const pair = new TextWithID();
                pair.id = x.id;
                pair.content = x.content;
                dao.samples.push(pair);
            });
            return dao;
        };
        const toWorldDAO = (vm: World): WorldDAO => {
            const dao = new WorldDAO();
            dao.id = vm.id;
            dao.name = vm.name;
            dao.expanding = vm.expanding;
            vm.countries.forEach(x => dao.countries.push(toCountryDAO(x)));
            return dao;
        };
        
        const dao = new WorldsDAO();
        viewmodel.worldGroups.forEach(x => dao.worldGroups.push(toWorldDAO(x)));
        return dao;
    }
    private static fromWorldsDAO(dao: WorldsDAO): Worlds {
        const fromCountryDAO = (dao: CountryDAO, parent: World): Country => {
            const country = new Country(dao.name, parent);
            country.id = dao.id;
            country.description = dao.description;
            country.editing = dao.editing;
            country.image.id = dao.image.id;
            country.image.content = dao.image.content;
            country.samples.splice(0);
            dao.samples.forEach(x => {
                const imgr = new ImageResource(x.content);
                imgr.id = x.id;
                country.samples.push(imgr);
            });
            return country;
        };

        const fromWorldDAO = (dao: WorldDAO, parent: Worlds): World => {
            const world = new World(dao.name, parent);
            world.id = dao.id;
            world.expanding = dao.expanding;
            dao.countries.forEach(x => world.countries.push(fromCountryDAO(x, world)));
            return world;
        };
        
        const worlds = new Worlds();
        dao.worldGroups.forEach(x => worlds.appendWorld(fromWorldDAO(x, worlds)));
        return worlds;
    }

    private static toMemoDAO(viewmodel: Memos): MemoDAO {
        const toMemoItemDAO = (vm: MemoItem): MemoItemDAO => {
            const dao = new MemoItemDAO();
            dao.id = vm.id;
            dao.color = vm.color;
            dao.name = vm.name;
            dao.text = vm.text;
            return dao;
        };

        const dao = new MemoDAO();
        dao.id = viewmodel.id;
        dao.color = viewmodel.filterColor;
        viewmodel.memoList.forEach(x => dao.memoList.push(toMemoItemDAO(x)));
        return dao;
    }
    private static fromMemoDAO(dao: MemoDAO): Memos {
        const fromMemoItemDAO = (dao: MemoItemDAO, parent: Memos): MemoItem => {
            const item = new MemoItem(dao.name, parent);
            item.id = dao.id;
            item.color = dao.color;
            item.text = dao.text;
            return item;
        };
        
        const memos = new Memos();
        memos.id = dao.id;
        memos.filterColor = dao.color;
        if(memos.filterColor === undefined) { memos.filterColor = "transparent"; }
        dao.memoList.forEach(x => memos.memoList.push(fromMemoItemDAO(x, memos)));
        return memos;
    }
}

// Common classes
class TextWithID {
    public id = "";
    public content = "";
}

// DAO classes
class StoriesDAO {
    public id = "";
    public editing = false;
    public content: StoryDataDAO = new StoryDataDAO();
    public children: StoriesDAO[] = new Array<StoriesDAO>();
    public isdir = false;
    public parentID = "";
}
class StoryDataDAO {
    public caption = "";
    public description = "";
    public color = "#333333";
    public time = 0;
    public lores: StoryItemDAO[] = new Array<StoryItemDAO>();
}
class StoryItemDAO {
    public id = "";
    public title = "";
    public color = "#383838";
    public stories: TextWithID[] = new Array<TextWithID>();
}

class DictionaryDAO {
    public words: WordDAO[] = new Array<WordDAO>();
}
class WordDAO {
    public id = "";
    public editing = false;
    public caption = "";
    public description = "";
    public resources: TextWithID[] = new Array<TextWithID>();
}

class ActorsDAO {
    public actors: ActorItemDAO[] = new Array<ActorItemDAO>();
}
class ActorItemDAO {
    public id = "";
    public name = "";
    public face: TextWithID = new TextWithID();
    public introduce = "";
    public detail = "";
    public images: TextWithID[] = new Array<TextWithID>();
}

class WorldsDAO {
    public worldGroups: WorldDAO[] = new Array<WorldDAO>();
}
class WorldDAO {
    public id = "";
    public name = "";
    public expanding = false;
    public countries: CountryDAO[] = new Array<CountryDAO>();
}
class CountryDAO {
    public id = "";
    public name = "";
    public description = "";
    public image: TextWithID = new TextWithID();
    public samples: TextWithID[] = new Array<TextWithID>();
    public editing = false;
}

class MemoDAO {
    public id = "";
    public color = "transparent";
    public memoList: MemoItemDAO[] = new Array<MemoItemDAO>();
}
class MemoItemDAO {
    public id = "";
    public color = "";
    public name = "";
    public text = "";
}