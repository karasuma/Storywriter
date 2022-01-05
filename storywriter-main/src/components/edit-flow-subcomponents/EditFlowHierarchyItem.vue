<template>
    <div>
        <ModalMessageBox
            :isVisible="showMsgBox"
            :param="message"
            :result="getResult"
        />
        <ModalSimpleInputBox
            :isVisible="showInputBox"
            :result="getResultInput"
            :caption="inputCaption"
            :defaultText="defaultText"
        />
        <ul class="container">
            <li v-for="lore in stories" :key="lore">
                <div v-if="lore.isDirectory()">
                    <div class="container__caret">
                        <img src="../../assets/caret.png" @click="toggleDir(lore)"
                        :class="{hierarchy__unexpand__img: lore.isExpanding, container__caret__arrow: true}">
                        <p @click="toggleDir(lore)">{{ lore.content.caption }}</p>
                        <img src="../../assets/arrow.png" @click="moveDir(lore.id, true, canMoveCss(lore, false))"
                        :class="{container__caret__button: true, unvisible: !canMoveCss(lore, false)}" style="transform: rotate(90deg);">
                        <img src="../../assets/arrow.png" @click="moveDir(lore.id, false, canMoveCss(lore, true))"
                        :class="{container__caret__button: true, unvisible: !canMoveCss(lore, true)}" style="transform: rotate(-90deg);">
                        <img src="../../assets/edit.png" @click="askEditCaption(lore)"
                        class="container__caret__button">
                        <img src="../../assets/dispose.png" @click="askDispose(lore)"
                        class="container__caret__button">
                    </div>
                    <EditFlowHierarchyItem
                        :root="lore"
                        :class="{hierarchy__unexpand: lore.isExpanding, child__hierarchy: true}"
                    />
                </div>
                <div v-else>
                    <div class="container__edit">
                        <span v-if="lore.isEditing">
                            <p class="hierarchy__selected" :style="setBorderLine(lore)">
                                {{ lore.content.caption }}
                            </p>
                        </span>
                        <span v-else>
                            <p @click="changeEditMode(lore)" :style="setBorderLine(lore)">
                                {{ lore.content.caption }}
                            </p>
                        </span>
                        <div class="container__edit__buttons">
                            <img src="../../assets/who.png" class="container__edit__buttons__button unvisible">
                            <img src="../../assets/who.png" class="container__edit__buttons__button unvisible">
                            <img src="../../assets/arrow.png" @click="moveDir(lore.id, true, canMoveCss(lore, false))"
                            :class="{container__edit__buttons__button: true, unvisible: !canMoveCss(lore, false)}"
                            style="transform: rotate(90deg);">
                            <img src="../../assets/arrow.png" @click="moveDir(lore.id, false, canMoveCss(lore, true))"
                            :class="{container__edit__buttons__button: true, unvisible: !canMoveCss(lore, true)}"
                            style="transform: rotate(-90deg);">
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="container-add">
            <img src="../../assets/add-file.png" @click="askNewStory(false)">
            <img src="../../assets/add-folder.png" @click="askNewStory(true)">
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Defs } from "../models/defs";
import { Stories } from "../models/story/stories";
import { MessageObject } from "../models/utils";

import ModalMessageBox from "../util-subcomponents/ModalMessageBox.vue";
import ModalSimpleInputBox from "../util-subcomponents/ModalSimpleInputBox.vue";


@Options({
    name: "EditFlowHierarchyItem",
    components: {
        EditFlowHierarchyItem,
        ModalMessageBox,
        ModalSimpleInputBox
    },
    props: {
        root: Stories,
    },
    methods: {
        toggleDir: function(story: Stories) {
            story.isExpanding = !story.isExpanding;
        },
        changeEditMode: function(story: Stories) {
            story.editing(true);
        },
        setBorderLine: function(story: Stories): string {
            if(story.isDirectory()) {
                return "";
            }
            const p = "padding-left: 7px;";
            return p + "border-left: solid 4px " + story.content.color + ";";
        },
        askDispose: function(lore: Stories) {
            this.selectingId = lore.id;
            let msg = "このストーリーを削除しますか？<br>";
            msg += '<b style="padding: 0 3px; font-size: 16px;">';
            msg += lore.content.caption + "</b><br>";
            msg += "(ストーリー内の小話も削除されます。)";
            this.message = MessageObject.createMessage(
                "警告",
                msg,
                true
            );
            this.showMsgBox = true;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                Stories.removeTargetStory(this.stories, this.selectingId);
            }
            this.showMsgBox = false;
        },
        getResultInput: function(result: string) {
            this.showInputBox = false;
            this.inputContent = result;
            this.defaultText = "";
            if(this.inputContent.length > 0) {
                if(this.isEditCaption) {
                    this.selectingLore.content.caption = result;
                } else {
                    this.root.appendNewStory(this.createAsDir, this.inputContent);
                }
            }
        },
        askNewStory: function(isdir: boolean) {
            this.createAsDir = isdir;
            this.isEditCaption = false;
            this.showInputBox = true;
        },
        askEditCaption: function(lore: Stories) {
            this.selectingLore = lore;
            this.isEditCaption = true;
            this.defaultText = lore.content.caption;
            this.showInputBox = true;
        },
        moveDir: function(id: string, isUp: boolean, executable: boolean): void {
            if(!executable) return;
            this.root.moveStory(id, isUp);
        },
        canMoveCss: function(lore: Stories, isUp: boolean): boolean {
            const currDirs = Stories
                .flatStories(lore.root.children)
                .find((x: Stories) => x.id == lore.id)!.parent!.children;
            const idx = currDirs.findIndex((x: Stories) => x.id == lore.id);
            const result = (!isUp && idx > 0) || (isUp && idx < currDirs.length - 1);
            return result;
        }
    },
    computed: {
        stories: function(): Array<Stories> {
            return this.root.children;
        },
        inputCaption: function(): string {
            if(this.isEditCaption) return "名前の変更";
            const genre = this.createAsDir ? "グループ" : "お話";
            return "新しい" + genre + "の作成";
        }
    }
})

export default class EditFlowHierarchyItem extends Vue {
    public root!: Stories;
    
    public expanding = false;

    public showMsgBox = false;
    public message: MessageObject = MessageObject.createMessage("", "");

    public showInputBox = false;
    public inputContent = "";
    public createAsDir = false;
    public defaultText = "";
    public isEditCaption = false;

    public selectingId = "";
    public selectingLore: Stories = new Stories(false);
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';

.container {
    list-style: none;
    padding-left: 12px;

    & * {
        font-size: 12px;
        cursor: pointer;
    }

    & p {
        text-align: left;
        margin-left: 10px;
        line-height: 1.2em;
        padding: 4px 0;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
    }
    & p:hover {
        color: $Font-Selected-Color;
    }

    &__caret {
        font-weight: bold;
        user-select: none;
        display: flex;
        justify-content: center;
        margin-top: 6px;

        &__arrow {
            width: 12px;
            height: 12px;
            margin: auto 3px;
            transform: rotate(90deg);
        }

        & p {
            margin: 3px;
            padding: 0;
            width: 100%;
        }

        &__button {
            width: 17px;
            height: 17px;
            margin-right: 6px;
            filter: brightness($Normal-Brightness);
            &:hover {
                filter: brightness($Focus-Brightness);
            }
        }

        &:hover {
            color: $Font-Selected-Color;
        }
    }

    &__edit {
        user-select: none;
        display: flex;
        justify-content: space-between;

        &:hover {
            background-color: $Hover-Color;
        }

        & * {
            @include hide-overflow-text();
        }

        &__buttons {
            display: flex;
            flex-direction: row-reverse;
            justify-content: flex-end;
            min-width: 90px;
            margin-right: 0;

            &__button {
                width: 17px;
                height: 17px;
                margin-right: 6px;
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
        }
    }

    & .hierarchy__selected {
        color: $Selected-Item-Color;
    }

    & .child__hierarchy {
        border-left: solid 1px $Hierarchy-Color-Line;
        margin-left: 8.5px;
        padding-left: 2px;
    }

    & .hierarchy__unexpand {
        display: none;
    }
    & .hierarchy__unexpand__img {
        transform: rotate(0deg);
    }
}

.container-add {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 30px;
    padding: 2px 0;
    margin-top: 6px;
    display: flex;
    justify-content: center;
    & img {
        width: 20px;
        height: 20px;
        margin: 0 4px;
        filter: brightness($Normal-Brightness);
        &:hover {
            filter: brightness($Focus-Brightness);
        }
    }
}

.unvisible {
    opacity: 0;
    @include unselectable();
}
</style>