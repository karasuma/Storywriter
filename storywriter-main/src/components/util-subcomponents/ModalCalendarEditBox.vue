<template>
    <teleport to="#modal-calendaredit" v-if="isVisible">
        <div class="modal" id="modal-calendar">
            <div class="modal__content">
                <div class="modal__content__header">
                    <p class="modal__content__header-caption">Change history...</p>
                    <p class="modal__content__header-close" @click="disable">&times;</p>
                </div>
                <ul class="modal__content__stories">
                    <li class="modal__content__stories-item"
                        draggable="true"
                        :style="getBorderColor(story.content.color)"
                        v-for="story in storiesByTime" :key="story"
                        :id="story.id"
                        @dragstart="dragStart(story.id, $event)"
                        @dragover="dragOver(story.id, $event)"
                        @dragleave="dragLeave(story.id)"
                        @drop="onDrop(story.id, $event)">
                        <p class="modal__content__stories-item-line">|||</p>
                        <p class="modal__content__stories-item-text">{{ story.content.caption }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Stories } from "../models/story/stories";
import { Utils } from "../models/utils";

@Options({
    props: {
        isVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        stories: {
            type: Array,
            required: true
        },
        close: {
            type: Function,
            required: true
        }
    },
    methods: {
        disable() {
            this.close();
        },
        dragStart: function(id: string, event: DragEvent) {
            event.dataTransfer?.setData('text/plain', id);
        },
        dragOver: function(id: string, event: DragEvent) {
            event.preventDefault();
            const el = document.getElementById(id);
            if(el === null) return;
            const rect = el.getBoundingClientRect();
            const color = "#fc503d";
            if((event.clientY - rect.top) < (el.clientHeight * 0.5)) {
                el.style.borderTop = "solid 3px " + color;
                el.style.borderBottom = "";
            } else {
                el.style.borderTop = "";
                el.style.borderBottom = "solid 3px " + color;
            }
        },
        dragLeave: function(id: string) {
            const el = document.getElementById(id);
            if(el === null) return;
            el.style.borderTop = "";
            el.style.borderBottom = "";
        },
        onDrop: function(id: string, event: DragEvent) {
            event.preventDefault();
            const receivedId = event.dataTransfer?.getData('text/plain');
            if(receivedId === undefined) return;
            const draggedEl = document.getElementById(receivedId);
            if(draggedEl === null) return;

            const el = document.getElementById(id);
            if(el === null) return;
            const rect = el.getBoundingClientRect();
            if((event.clientY - rect.top) < (el.clientHeight * 0.5)) {
                // Drop upside on the target
                el.parentNode?.insertBefore(draggedEl, el);
                this.adjustStoriesTimeline(receivedId, id);
            } else {
                // Drop downside on the target
                const nextel = el.nextElementSibling;
                el.parentNode?.insertBefore(draggedEl, nextel);
                this.adjustStoriesTimeline(receivedId, nextel?.getAttribute("id"));
            }
            this.dragLeave(id);
        },
        getBorderColor: function(color: string): string {
            return "border-left: solid 4px " + color + ";";
        }
    },
    computed: {
        storiesByTime: function(): Array<Stories> {
            return Stories.flatStories(this.stories)
                .filter((x: Stories) => !x.isDirectory())
                .sort((p: Stories, c: Stories) => {
                    return Utils.sortCondition(p.content.time, c.content.time);
                });
        }
    }
})

export default class ModalCalendarEditBox extends Vue {
    isVisible!: boolean;
    stories!: Array<Stories>;
    close!: Function;

    public packStoriesBasedOnTimeline(flatten: Array<Stories>) {
        flatten
            .sort((c: Stories, p: Stories) => Utils.sortCondition(c.content.time, p.content.time))
            .forEach((x: Stories, i: number) => x.content.time = i);
    }

    public moveStoryBasedOnTimeline(flatten: Array<Stories>, currentIndex: number, insertIndex: number) {
        // Shift indexes after insertIndex
        flatten
            .filter((x: Stories) => x.content.time >= insertIndex)
            .forEach((x: Stories) => x.content.time++);
        
        // Move dropped content to the position you want to insert
        const newCurrentIndex = currentIndex > insertIndex ? currentIndex + 1 : currentIndex;
        const moveTarget = flatten
            .find((x: Stories) => x.content.time == newCurrentIndex);
        if(moveTarget !== undefined) {
            moveTarget.content.time = insertIndex;
        }
    }

    public adjustStoriesTimeline(movedId: string, nextSiblingId: string | undefined) {
        const flatten = Stories.flatStories(this.stories).filter((x: Stories) => !x.isDirectory());
        const movedStory = flatten.find((x: Stories) => x.id == movedId);
        if(movedStory === undefined) return;

        const moveTargetIndex = movedStory.content.time;
        if(nextSiblingId === undefined) {
            // current dropped element was placed for the last
            const destIndex = flatten[flatten.length - 1].content.time + 1;
            movedStory.content.time = destIndex;
            this.moveStoryBasedOnTimeline(flatten, moveTargetIndex, destIndex);
        } else {
            const nextStory = flatten.find((x: Stories) => x.id == nextSiblingId);
            if(nextStory === undefined) return;
            const destIndex = nextStory.content.time;
            this.moveStoryBasedOnTimeline(flatten, moveTargetIndex, destIndex);
        }
        this.packStoriesBasedOnTimeline(flatten);
    }
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';
@import '../templates/modal.scss';

.modal {
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    z-index: $Modal-ZIndex;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);

    & * {
        color: $Modal-Font-Color;
        user-select: none;
        cursor: default;
    }

    &__content {
        background-color: $Modal-Background;
        margin: 30vh 35vw;
        border: solid 1px $Hierarchy-Color-Line;
        border-radius: 6px;
        box-shadow: 0 0 10px gray;

        &__header {
            width: 100%;
            height: 32px;
            display: flex;
            justify-content: right;

            &-caption {
                width: 100%;
                font-size: 14px;
                margin: 3px 14px;
                padding-top: 2px;
                text-align: center;
                @include hide-overflow-text();
            }
            
            &-close {
                width: 52px;
                text-align: center;
                font-size: 41px;
                line-height: 22px;
                border-top-right-radius: 6px;
                &:hover {
                    background-color: $Modal-Button-Focus;
                }
            }
        }

        &__stories {
            width: 100%;
            height: calc( 100% - 40vh - 32px );
            list-style-type: none;
            padding: 0;

            &-item {
                border-top: solid 1px $Modal-Font-Color;
                padding: 4px 0;
                width: calc( 100% - 4px );
                display: flex;
                cursor: pointer;

                & * {
                    color: $Modal-Font-Color;
                    padding: 3px 0;
                }
                &-line {
                    color: #666;
                    letter-spacing: 0em;
                    width: 1em;
                    margin: 0 6px;
                }
                &-text {
                    width: 100%;
                    margin: 0 16px;
                    @include hide-overflow-text();
                }

                &:hover {
                    background-color: #ccc;
                }
            }
        }
    }
}
</style>