<template>
    <div class="section">
        <ModalMessageBox
            v-bind:isVisible="showMsgbox"
            :param="messages"
            :result="getResult"
        />
        <div class="section__ctrlheader">
            <p>︙</p>
            <img src="../../assets/dispose.png" @click="askDispose">
            <img src="../../assets/calendar.png">
        </div>
        <textarea v-model="content.title" rows="1" spellcheck="false" class="section__header"></textarea>

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
import { Defs } from "../models/defs";
import { MessageObject, IReceiveString } from "../models/utils";
import { PropType } from "@vue/runtime-core";

@Options({
    components: {
        ModalMessageBox,
    },
    props: {
        content: StoryItem,
        remove: Function as PropType<IReceiveString>
    },
    methods: {
        addStory: function(c: StoryItem) {
            c.addStory();
        },
        askDispose: function() {
            this.showMsgbox = true;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                this.remove(this.content.id);
            }
            this.showMsgbox = false;
        }
    }
})

export default class EditFlowSectionItem extends Vue {
    content!: StoryItem;
    remove!: IReceiveString;

    showMsgbox: boolean = false;
    messages: MessageObject = MessageObject.createMessage("Information", "Sample message here.");
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