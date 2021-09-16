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
        ></textarea>

        <div v-for="story in content.stories" :key="story" class="section__content">
            <textarea v-model="story.text" spellcheck="false"></textarea>
        </div>
        <div class="section__control">
            <img src="../../assets/add.png" @click="addStory(content)">
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { StoryItem } from "../models/story/story-item";
import ModalMessageBox from "../util-subcomponents/ModalMessageBox.vue";
import ModalColorPicker from "../util-subcomponents/ModalColorPicker.vue";
import { Defs } from "../models/defs";
import { MessageObject, IReceiveString } from "../models/utils";
import { PropType } from "@vue/runtime-core";
import { StoryData } from "../models/story/story-data";

@Options({
    components: {
        ModalMessageBox,
        ModalColorPicker
    },
    props: {
        content: StoryItem,
        parent: StoryData,
        remove: Function as PropType<IReceiveString>,
        move: Function as PropType<IReceiveString>
    },
    methods: {
        addStory: function(c: StoryItem) {
            c.addStory();
        },
        askDispose: function() {
            this.messages = MessageObject.createMessage(
                "Warning",
                    "Are you sure you want to erase<br>"
                        + '<b style="padding: 0 3px; font-size: 16px;">'
                        + "' " + this.content.title + " '"
                        + "</b>"
                    + " ?",
                true
            );
            this.showMsgbox = true;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                this.remove(this.content.id);
            }
            this.showMsgbox = false;
        },
        chooseColor: function() {
            this.showPickerbox = true;
        },
        getColor: function(color: string) {
            if (color.length > 0) {
                this.content.color = color;
            }
            this.showPickerbox = false;
        },
        movePosition: function(up: boolean) {
            const dir = up ? "up" : "down";
            this.move(dir + ":" + this.content.id);
        }
    },
    computed: {
        canUp: function(): Boolean {
            return this.getCurrentIndex() > 0;
        },
        canDown: function(): Boolean {
            return this.getCurrentIndex() < this.parent.lores.length - 1;
        }
    }
})

export default class EditFlowSectionItem extends Vue {
    content!: StoryItem;
    parent!: StoryData;
    remove!: IReceiveString;
    move!: IReceiveString;

    showMsgbox: boolean = false;
    messages: MessageObject = MessageObject.createMessage("Information", "Sample message here.");

    showPickerbox: boolean = false;

    public getCurrentIndex(): number {
        return this.parent.getLoreIndex(this.content);
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

        & textarea {
            border-radius: 2;
            border: dashed 1px $Hierarchy-Color-Line;
            border-bottom: solid 1px $Button-Normal;
            padding-left: 14px;
            width: calc(100% - 23px);
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