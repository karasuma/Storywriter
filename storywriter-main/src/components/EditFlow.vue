<template>
    <div id="edit-flow">
        <div class="hierarchy">
            <EditFlowHierarchyItem
                v-bind:stories="stories"
                :resetAllFlags="resetAllEdits"
            />
        </div>

        <div class="edit">
            <div v-if="hasEditing" class="edit__main">
                <input type="text" v-model="getEditing.content.caption" key="main-caption" placeholder="...">
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
            <div v-else class="edit__main">
                <p>there is no editing contents...</p>
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

@Options({
    components: {
        EditFlowHierarchyItem,
        EditFlowSectionItem
    },
    props: {
        stories: Array
    },
    methods: {
        addLore: function(content: StoryData) {
            content.addLore();
        },
        resetAllEdits: function() {
            for(const story of this.stories) {
                story.disableEditingChildren(true);
            }
        },
        deleteSectionItem: function(id: string) {
            this.getEditing.content.removeLore(id);
        },
        moveStoryPosition: function(arg: string) {
            const param = arg.split(":");
            const dir = param[0] === "up";
            const id = param[1];
            this.getEditing.content.moveLore(id, dir);
        }
    },
    computed: {
        getEditing: function(): Stories {
            return this.stories
                .map((x: Stories) => x.getEditingChildren())
                .find((x: Stories | undefined) => typeof x !== 'undefined');
        },
        hasEditing: function(): Boolean {
            return this.stories.some((x: Stories) => x.hasEditingChildren());
        },
    }
})

export default class EditFlow extends Vue {
    stories!: Array<Stories>
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

    & * {
        color: $Font-Color;
    }

    & .hierarchy {
        margin: 2px 0;
        margin-right: 14px;
        width: $Hierarchy-Width;
        height: 100vh;
        background-color: $Background-Color-Hierarchy;
        padding: 6px 0;
        padding-right: 8px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    & .edit {
        position: fixed;
        top: 0;
        bottom: 0;
        left: $Control-Width;
        width: calc( 100vw - #{$Control-Width} - 40px );
        margin: $Header-Height 0;
        padding: 0 20px;
        overflow-y: scroll;
        background-color: $Background-Color;

        &__main {
            width: 100%;

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
        }
    }
}
</style>