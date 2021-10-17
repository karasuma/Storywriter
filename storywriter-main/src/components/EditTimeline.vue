<template>
    <div id="edit-timeline">
        <div class="search">
            <img src="../assets/search.png">
            <div class="search__input">
                <input type="text" v-model="searchText" spellcheck="false" placeholder="search...">
                <p v-show="showCounter">{{ matchCount }} stor{{ matchCount > 1 ? 'ies' : 'y' }} found.</p>
            </div>
        </div>

        <div class="timeline">
            <div class="timeline__content" :style="calcHeightCss">
                <TimelineLabel
                    v-for="story in stories" :key="story"
                    :story="story" :darkmode="true"
                    :span="labelSpan"
                    :style="searchTargetCss(story.content.caption)"
                    @click="selectStory(story)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Stories } from "./models/story/stories";
import TimelineLabel from "./edit-timeline-subcomponents/TimelineLabel.vue";

@Options({
    components: {
        TimelineLabel
    },
    props: {
        root: {
            type: Stories,
            required: true
        },
        select: {
            type: Function,
            required: true
        }
    },
    methods: {
        selectStory: function(story: Stories) {
            story.editing(true);
            this.select();
        },
        searchTargetCss: function(me: string): string {
            if(this.searchText.length == 0 || me.indexOf(this.searchText) != -1) {
                return "";
            }
            return "opacity: 0.4;";
        }
    },
    computed: {
        stories: function(): Array<Stories> {
            return Stories.flatStories(this.root.children)
                .filter((x: Stories) => !x.isDirectory());
        },
        calcHeightCss: function(): string {
            const lastTime = this.root.getLastChildTimelineIndex();
            const contentHeight = this.labelSpan * lastTime;
            return "height: calc(" + contentHeight + "px + 5em);"
        },
        showCounter: function(): boolean {
            return this.foundMatchStories().length > 0;
        },
        matchCount: function(): number {
            return this.foundMatchStories().length;
        }
    }
})

export default class EditTimeline extends Vue {
    root!: Stories;
    select!: Function;

    labelSpan: number = 55;
    searchText: string = "";

    public foundMatchStories(): Array<Stories> {
        if(this.searchText.length == 0) return new Array<Stories>();
        const flatten = Stories.flatStories(this.root.children).filter(x => !x.isDirectory());
        return flatten.filter(x => x.content.caption.indexOf(this.searchText) != -1);
    }
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

#edit-timeline {
    position: fixed;
    top: $Header-Height;
    bottom: $Footer-Height;
    left: calc( #{$Menu-Width} + 1px );
    width: calc( 100vw - #{$Menu-Width} );
    border-left: solid 1px $Hierarchy-Color-Line;

    & * { color: $Font-Color; }

    & .search {
        display: flex;
        justify-content: flex-end;
        width: calc( 100% - 80px );
        margin: 20px 40px;

        &__input {
            width: 50%;
            margin: auto 0;
            display: flex;
            flex-direction: column;

            & input {
                border: none;
                border-bottom: solid 1px $Separator-Color;
                border-radius: 0;
                font-size: 14px;
                font-weight: bold;
                width: 100%;
                height: 3em;
                &:focus {
                    border-bottom: solid 1px $Font-Selected-Color;
                }
            }

            & p {
                width: 100%;
                font-size: 14px;
                text-align: right;
                margin-top: 3px;
                margin-bottom: 8px;
            }
        }

        & img {
            width: 19px;
            height: 19px;
            margin: auto 4px;
            padding: 8px 12px;
            filter: brightness($Normal-Brightness);
        }
    }

    & .timeline {
        position: fixed;
        top: calc( #{$Header-Height} + 80px );
        left: calc( #{$Menu-Width} + 31px );
        width: calc( 100% - #{$Menu-Width} - 90px );
        margin: 25px 0;
        padding: 0 10px;
        border: solid 1px $Separator-Color;
        border-radius: 6px;
        height: 79vh;
        overflow-y: scroll;

        &__content {
            background: repeating-linear-gradient(transparent, transparent 70px, $Separator-Color 70px, $Separator-Color 72px);
            min-height: calc( 100vh - #{$Header-Height} - 170px );
            margin-bottom: $Footer-Height;
        }
    }
}
</style>