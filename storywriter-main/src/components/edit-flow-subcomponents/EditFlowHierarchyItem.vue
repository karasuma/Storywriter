<template>
    <ul class="container">
        <li v-for="lore in stories" :key="lore">
            <div v-if="lore.isDirectory()">
                <div class="container--caret" @click="toggleDir()">
                    <img src="../../assets/caret.png"
                    :class="{hierarchy__unexpand__img: expanding}">
                    {{ lore.content.caption }}
                </div>
                <EditFlowHierarchyItem
                    :stories="lore.children"
                    :class="{hierarchy__unexpand: expanding}"
                    :resetAllFlags="resetAllFlags"
                />
            </div>
            <div v-else>
                <span v-if="lore.isEditing">
                    <p class="hierarchy__selected">
                        {{ lore.content.caption }}
                    </p>
                </span>
                <span v-else>
                    <p @click="changeEditMode(lore)">{{ lore.content.caption }}</p>
                </span>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Stories } from "../models/story/stories";



@Options({
    name: "EditFlowHierarchyItem",
    components: {
        EditFlowHierarchyItem
    },
    props: {
        stories: Array,
        resetAllFlags: Function
    },
    methods: {
        toggleDir: function() {
            this.expanding = !this.expanding;
        },
        changeEditMode: function(story: Stories) {
            this.resetAllFlags();
            story.editing(true);
        }
    }
})

export default class EditFlowHierarchyItem extends Vue {
    public stories!: Array<Stories>;
    public resetAllFlags!: Function;
    
    public expanding: Boolean = false;
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
        margin-left: 20px;
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

    &--caret {
        font-weight: bold;
        user-select: none;

        & img {
            width: 12px;
            margin: 0 6px;
            transform:rotate(90deg);
        }

        & + ul > li {
            border-left: solid 1px $Hierarchy-Color-Line;
            padding-left: 2px;
        }
    }
    &--caret:hover {
        color: $Font-Selected-Color;
    }

    & .hierarchy__selected {
        color: $Selected-Item-Color;
    }

    & .hierarchy__unexpand {
        display: none;
    }
    & .hierarchy__unexpand__img {
        transform:rotate(0deg);
    }
}
</style>