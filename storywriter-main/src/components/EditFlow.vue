<template>
    <div id="edit-flow">
        <ModalMessageBox
            :isVisible="showMsgBox"
            :param="message"
            :result="getResult"
        />
        <ModalCalendarEditBox
            :isVisible="showCalendar"
            :stories="stories"
            :close="closeCalendar"
        />
        <ModalColorPicker
            :isVisible="showPickerbox"
            :getColor="getColor"
            :darkmode="false"
        />

        <div class="hierarchy">
            <EditFlowHierarchyItem
                :root="root"
            />
        </div>

        <div class="edit">
            <div v-if="hasEditing" class="edit__main">
                <div class="edit__main__header"
                    :style="getBorderColor(getEditing.content.color)">
                    <input type="text" v-model="getEditing.content.caption" key="main-caption" placeholder="..." spellcheck="false">
                    <img src="../assets/paint.png" @click="chooseColor">
                    <img src="../assets/calendar.png" @click="changeCalendar">
                    <img src="../assets/dispose.png" @click="askDispose">
                </div>
                <div class="edit__main__desc">
                    <textarea v-model="getEditing.content.description" spellcheck="false" maxlength="200"></textarea>
                    <div class="edit__main__desc__chars">
                        {{ getEditing.content.description.length }}/200
                    </div>
                </div>

                <hr>

                <EditFlowSectionItem
                    v-for="lore in getEditing.content.lores" :key="lore"
                    :content="lore"
                    :parent="getEditing.content"
                    :remove="deleteSectionItem"
                    :move="moveStoryPosition"
                />

                <div class="edit__main__add">
                    <img src="../assets/add.png" @click="addLore(getEditing.content)">
                </div>
            </div>
            <div v-else class="edit__main edit__main__bg">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Stories } from "./models/story/stories";
import { StoryData } from "./models/story/story-data";
import EditFlowHierarchyItem from "./edit-flow-subcomponents/EditFlowHierarchyItem.vue";
import EditFlowSectionItem from "./edit-flow-subcomponents/EditFlowSectionItem.vue";
import ModalMessageBox from "./util-subcomponents/ModalMessageBox.vue";
import ModalCalendarEditBox from "./util-subcomponents/ModalCalendarEditBox.vue";
import ModalColorPicker from "./util-subcomponents/ModalColorPicker.vue";
import { MessageObject } from "./models/utils";
import { Defs } from "./models/defs";

@Options({
    components: {
        EditFlowHierarchyItem,
        EditFlowSectionItem,
        ModalMessageBox,
        ModalCalendarEditBox,
        ModalColorPicker
    },
    props: {
        root: Stories,
    },
    methods: {
        addLore: function(content: StoryData) {
            content.addLore();
        },
        deleteSectionItem: function(id: string) {
            this.getEditing.content.removeLore(id);
        },
        moveStoryPosition: function(arg: string) {
            const param = arg.split(":");
            const dir = param[0] === "up";
            const id = param[1];
            this.getEditing.content.moveLore(id, dir);
        },
        askDispose: function() {
            this.message = MessageObject.createMessage(
                "Warning",
                    "Are you sure you want to remove<br>"
                        + '<b style="padding: 0 3px; font-size: 16px;">'
                        + "' " + this.getEditing.content.caption + " '"
                        + "</b>"
                    + " ?",
                true
            );
            this.showMsgBox = true;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                Stories.removeTargetStory(this.stories, this.getEditing.id);
            }
            this.showMsgBox = false;
        },
        changeCalendar: function() {
            this.showCalendar = true;
        },
        closeCalendar: function() {
            this.showCalendar = false;
        },
        chooseColor: function() {
            this.showPickerbox = true;
        },
        getColor: function(color: string) {
            if (color.length > 0) {
                this.getEditing.content.color = color;
            }
            this.showPickerbox = false;
        },
        getBorderColor: function(color: string): string {
            return "border-top: groove 8px " + color + ";";
        }
    },
    computed: {
        stories: function():Array<Stories> {
            return this.root.children;
        },
        getEditing: function(): Stories | undefined {
            return this.root.getEditingChildren();
        },
        hasEditing: function(): Boolean {
            return this.getEditing !== undefined;
        },
    }
})

export default class EditFlow extends Vue {
    root!: Stories;

    showMsgBox: boolean = false;
    message: MessageObject = MessageObject.createMessage("Warning", "");

    showCalendar: boolean = false;
    showPickerbox: boolean = false;
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

#edit-flow {
    position: fixed;
    top: $Header-Height;
    bottom: $Footer-Height;
    left: calc( #{$Menu-Width} + 1px );
    border-left: solid 1px $Hierarchy-Color-Line;

    & * {
        color: $Font-Color;
    }

    & .hierarchy {
        @include hierarchy-base($Background-Color-Hierarchy);
    }

    & .edit {
        @include edit-base($Background-Color);

        &__main {
            width: 100%;
            height: calc(100vh - $Control-Height);

            & input {
                border: none;
                border-bottom: solid 1px $Separator-Color;
                border-radius: 0;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin: 12px auto;
                width: 100%;
                height: 2.3em;
            }
            & input:focus {
                border-bottom: solid 1px $Font-Selected-Color;
            }

            & textarea:focus {
                border: solid 1px $Font-Selected-Color;
            }
            
            & h1 {
                font-size: 38px;
                font-weight: lighter;
                margin: 10px;
                text-align: center;
                cursor: default;
                user-select: none;
            }

            &__header {
                width: 100%;
                display: flex;
                padding-bottom: 14px;

                & input {
                    width: 100%;
                }
                & img {
                    margin: auto 7px;
                    width: 28px;
                    height: 28px;
                    filter: brightness($Normal-Brightness);
                }
                & img:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
            
            &__desc__chars {
                width: 100%;
                text-align: right;
            }

            &__add {
                width: 100%;
                height: 48px;

                & img {
                    display: block;
                    margin: 0 auto;
                    width: 32px;
                    height: 32px;
                    filter: brightness($Normal-Brightness);
                }
                & img:hover {
                    filter: brightness($Focus-Brightness);
                }
            }

            &__bg {
                background-image: url("../assets/edit.png");
                background-size: cover;
                background-attachment: fixed;
                background-position: center center;
                filter: brightness(0.4);
            }
        }
    }
}
</style>