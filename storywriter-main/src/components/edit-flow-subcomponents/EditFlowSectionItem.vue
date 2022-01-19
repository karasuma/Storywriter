<template>
    <div class="section" :style="{ backgroundColor: content.color }">
        <ModalMessageBox
            v-bind:isVisible="showMsgbox"
            :param="messages"
            :result="getResult"
        />
        <ModalColorPicker
            :isVisible="showPickerbox"
            :getColor="getColor"
        />
        <div class="section__ctrlheader">
            <img src="../../assets/dispose.png" @click="askDispose">
            <img src="../../assets/paint.png" @click="chooseColor">
            <img src="../../assets/arrow.png" class="section__ctrlheader-up"
                @click="movePosition(true)" v-show="canUp">
            <img src="../../assets/arrow.png" class="section__ctrlheader-down"
                @click="movePosition(false)" v-show="canDown">
        </div>
        <textarea v-model="content.title"
            rows="1" spellcheck="false" class="section__header"
            placeholder="..."
            @change="updateHistory()"
        ></textarea>

        <div v-for="story in content.stories" :key="story" class="section__content">
            <textarea v-model="story.text"
                spellcheck="false" rows="4"
                @change="updateHistory()"></textarea>
            <div class="section__content__controls">
                <img src="../../assets/arrow.png" class="section__content__controls-up"
                    @click="moveStoryPosition(story.id, true)" v-show="canStoryUp(story.id)">
                <img src="../../assets/arrow.png" class="section__content__controls-down"
                    @click="moveStoryPosition(story.id, false)" v-show="canStoryDown(story.id)">
            </div>
            <img src="../../assets/dispose.png" @click="disposeStory(story.id)">
        </div>
        <div class="section__control">
            <img src="../../assets/add.png" @click="addStory(content)">
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { StoryItem, StoryContent } from "../models/story/story-item";
import ModalMessageBox from "../util-subcomponents/ModalMessageBox.vue";
import ModalColorPicker from "../util-subcomponents/ModalColorPicker.vue";
import { Defs } from "../models/defs";
import { MessageObject, IReceiveString } from "../models/utils";
import { PropType } from "@vue/runtime-core";
import { StoryData } from "../models/story/story-data";
import { StoryWrtiterViewModel } from "../story-writer-viewmodel";

@Options({
    components: {
        ModalMessageBox,
        ModalColorPicker
    },
    props: {
        vm: StoryWrtiterViewModel,
        content: StoryItem,
        parent: StoryData,
        remove: Function as PropType<IReceiveString>,
        move: Function as PropType<IReceiveString>
    },
    methods: {
        updateHistory: function(): void {
            this.vm.history.Update(this.vm);
        },
        addStory: function(c: StoryItem) {
            c.addStory();
            this.updateHistory();
        },
        askDispose: function() {
            this.messages = MessageObject.createMessage(
                "注意",
                "この小話を削除しますか？<br>"
                    + '<b style="padding: 0 3px; font-size: 16px;">'
                    + "' " + this.content.title + " '"
                    + "</b>",
                true
            );
            this.showMsgbox = true;
            this.vm.modalShowing = true;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                this.remove(this.content.id);
                this.updateHistory();
            }
            this.showMsgbox = false;
            this.vm.modalShowing = false;
        },
        chooseColor: function() {
            this.showPickerbox = true;
            this.vm.modalShowing = true;
        },
        getColor: function(color: string) {
            if (color.length > 0) {
                this.content.color = color;
                this.updateHistory();
            }
            this.showPickerbox = false;
            this.vm.modalShowing = false;
        },
        movePosition: function(up: boolean) {
            const dir = up ? "up" : "down";
            this.move(dir + ":" + this.content.id);
            this.updateHistory();
        },
        moveStoryPosition: function(id: string, up: boolean) {
            const currentIdx = this.getStoryIndex(id);
            const neighborIdx = up ? currentIdx - 1 : currentIdx + 1;

            // Swap both of story
            const temp = this.content.stories[currentIdx];
            this.content.stories[currentIdx] = this.content.stories[neighborIdx];
            this.content.stories[neighborIdx] = temp;
            this.updateHistory();
        },
        disposeStory: function(id: string) {
            this.content.removeStory(this.getStoryIndex(id));
            this.updateHistory();
        },
        canStoryUp: function(id: string): boolean {
            return this.getStoryIndex(id) > 0;
        },
        canStoryDown: function(id: string): boolean {
            return this.getStoryIndex(id) < this.content.stories.length - 1;
        }
    },
    computed: {
        canUp: function(): boolean {
            return this.getCurrentIndex() > 0;
        },
        canDown: function(): boolean {
            return this.getCurrentIndex() < this.parent.lores.length - 1;
        }
    }
})

export default class EditFlowSectionItem extends Vue {
    vm!: StoryWrtiterViewModel;
    content!: StoryItem;
    parent!: StoryData;
    remove!: IReceiveString;
    move!: IReceiveString;

    showMsgbox = false;
    messages: MessageObject = MessageObject.createMessage("Information", "Sample message here.");

    showPickerbox = false;

    public getCurrentIndex(): number {
        return this.parent.getLoreIndex(this.content);
    }

    public getStoryIndex(id: string): number {
        return this.content.stories.findIndex((x: StoryContent) => x.id == id);
    }

    public abortModal(e: KeyboardEvent): void {
        if((e.ctrlKey || e.metaKey) && (e.key == 'z' || e.key == 'y')) {
            this.showMsgbox = false;
            this.showPickerbox = false;
            this.vm.modalShowing = false;
        }
    }
    mounted() {
        document.addEventListener("keydown", this.abortModal);
    }
    beforeDestroy() {
        document.removeEventListener("keydown", this.abortModal);
    }
}
</script>

<style lang="scss" scoped>
@import "../templates/darktheme.scss";
@import "../templates/common.scss";
            
.section {
    border-radius: 8px;
    border: solid 1px $Separator-Color;
    padding: 14px 8px;
    padding-top: 2px;
    margin-bottom: 21px;
    background-color: $Background-Color-Panel;
    overflow-x: hidden;

    & * {
        color: $Font-Color;
    }
    
    & img {
        filter: brightness($Normal-Brightness);
    }
    & img:hover {
        filter: brightness($Focus-Brightness);
    }

    &__ctrlheader {
        display: flex;
        flex-direction: row-reverse;
        height: 21px;
        margin: 12px 0;

        & * {
            margin: 0 8px;
            cursor: pointer;
            user-select: none;
            font-weight: bold;
            font-size: 1.2em;
            filter: brightness($Normal-Brightness);
        }
        & *:hover {
            filter: brightness($Focus-Brightness);
        }

        &-up {
            transform: rotate(90deg);
        }
        &-down {
            transform: rotate(-90deg);
        }
    }

    &__header {
        font-size: 28px;
        background-color: #26272c;
        margin-bottom: 13px;
    }

    &__content {
        margin-left: 15px;
        border-left: solid 1px $Button-Normal;
        padding-left: 8px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        & textarea {
            border-radius: 2;
            border: dashed 1px $Hierarchy-Color-Line;
            border-bottom: solid 1px $Button-Normal;
            padding-left: 14px;
            width: 100%;
        }

        &__controls {
            width: 32px;
            display: flex;
            flex-direction: column;
            align-content: center;

            & * {
                width: 18px;
                height: 18px;
                margin: 3px 0;
            }
            &-up {
                transform: rotate(90deg);
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
            &-down {
                transform: rotate(-90deg);
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
        }

        & img {
            width: 21px;
            height: 21px;
            margin: 6px;
            filter: brightness($Normal-Brightness);
            &:hover {
                filter: brightness($Focus-Brightness);
            }
        }
    }

    &__control {
        width: 100%;
        height: 28px;
        display: flex;
        margin-top: 11px;

        & img {
            height: 100%;
            margin-left: auto;
            margin-right: 8px;
        }
    }
}
</style>