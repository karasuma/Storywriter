<template>
    <div id="edit-timeline">
        <ModalCalendarEditBox
            :isVisible="showCalendar"
            :stories="vm.hierarchy.children"
            :close="closeCalendar"
        />

        <div class="controls">
            <div v-for="color in colors" :key="color"
                @click="filtering(color)"
                :style="[backgroundCss(color), selectedCss(color)]"></div>
        </div>

        <div class="timelines">
            <div class="timelines__search">
                <img class="timelines__search__calendar"
                    src="../assets/calendar.png" @click="changeCalendar">
                <img src="../assets/search.png">
                <div class="timelines__search__input">
                    <input type="text" v-model="searchText" spellcheck="false" placeholder="search...">
                    <p v-if="showCounter">{{ matchCount }} stor{{ matchCount > 1 ? 'ies' : 'y' }} found.</p>
                    <p v-else>...</p>
                </div>
            </div>
            <div class="timelines__timeline">
                <div class="timelines__timeline__content" :style="calcHeightCss">
                    <TimelineLabel
                        v-for="story in stories" :key="story"
                        :story="story" :darkmode="true"
                        :span="labelSpan"
                        :style="[searchTargetCss(story.content.caption), filteringCss(story.content.color)]"
                        @click="selectStory(story)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Stories } from "./models/story/stories";
import TimelineLabel from "./edit-timeline-subcomponents/TimelineLabel.vue";
import { Defs } from "./models/defs";
import { StoryWrtiterViewModel } from "./story-writer-viewmodel";
import ModalCalendarEditBox from "./util-subcomponents/ModalCalendarEditBox.vue";

@Options({
    components: {
        TimelineLabel,
        ModalCalendarEditBox
    },
    props: {
        vm: {
            type: StoryWrtiterViewModel,
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
        },
        backgroundCss: function(color: string): string {
            return `background-color: ${color};`;
        },
        selectedCss: function(color: string): string {
            if(color.length < 1 || color[0] != '#') return "";
            if(color == this.filteringColor) {
                return `filter: brightness(1.0); border: solid 3px #FFFFFF;`;
            }
            return "";
        },
        filteringCss: function(color: string): string {
            if(this.filteringColor.length < 1) return "";
            if(this.filteringColor[0] == "#" && this.filteringColor != color) {
                return "display: none;"
            }
            return "";
        },
        filtering: function(color: string): void {
            this.filteringColor = color;
        },
        changeCalendar: function() {
            this.showCalendar = true;
        },
        closeCalendar: function() {
            this.showCalendar = false;
        },
    },
    computed: {
        stories: function(): Array<Stories> {
            return Stories.flatStories(this.vm.hierarchy.children)
                .filter((x: Stories) => !x.isDirectory());
        },
        calcHeightCss: function(): string {
            const lastTime = this.vm.hierarchy.getLastChildTimelineIndex();
            const contentHeight = this.labelSpan * lastTime;
            return "height: calc(" + contentHeight + "px + 5em);"
        },
        showCounter: function(): boolean {
            return this.foundMatchStories().length > 0;
        },
        matchCount: function(): number {
            return this.foundMatchStories().length;
        },
        colors: function(): string[] {
            const colors = this.vm.setting.darkmode
                ? Defs.definedLightColors
                : Defs.definedDarkColors;
            const tlColors = new Array<string>();
            tlColors.push("transparent");
            colors.forEach(c => tlColors.push(c));
            return tlColors;
        },
    }
})

export default class EditTimeline extends Vue {
    vm!: StoryWrtiterViewModel;
    select!: Function;

    filteringColor: string = "";

    labelSpan: number = 55;
    searchText: string = "";
    
    showCalendar: boolean = false;

    public foundMatchStories(): Array<Stories> {
        if(this.searchText.length == 0) return new Array<Stories>();
        const flatten = Stories.flatStories(this.vm.hierarchy.children).filter(x => !x.isDirectory());
        const matches = flatten.filter(x => x.content.caption.indexOf(this.searchText) != -1);
        if(this.filteringColor.length > 0 && this.filteringColor[0] == "#") {
            return matches.filter(x => x.content.color == this.filteringColor);
        }
        return matches;
    }
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

$Filter-Width: 60px;
$Timeline-Width: calc( #{$Menu-Width} + #{$Filter-Width} );

#edit-timeline {
    @include edit-parent-base($Hierarchy-Color-Line);

    & * { color: $Font-Color; }

    & .controls {
        position: fixed;
        top: 0;
        bottom: 0;
        left: $Menu-Width;
        width: $Filter-Width;
        margin-top: $Header-Height;
        margin-bottom: $Footer-Height;
        padding: 6px 0;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: $Background-Color-Hierarchy;

        $Border-Thickness: 3px;
        $Margin: 8px;
        $Size-Padding: $Margin + $Margin + $Border-Thickness + $Border-Thickness;
        $Size: calc( #{$Filter-Width} - #{$Size-Padding} - 10px );
        & * {
            margin: $Margin;
            width: $Size;
            height: $Size;
            display: block;
            border: solid $Border-Thickness $Hierarchy-Color-Line;
            border-radius: 18px;
            filter: brightness($Normal-Brightness);
            &:hover {
                filter: brightness($Focus-Brightness);
            }

            &:first-child {
                margin-bottom: calc( #{$Margin} + #{$Size} );
            }
        }
    }

    & .timelines {
        $Timeline-Content-Width: calc( 100vw - #{$Timeline-Width} - 40px );
        position: fixed;
        top: 0;
        bottom: 0;
        left: $Timeline-Width;
        width: $Timeline-Content-Width;
        margin-top: $Header-Height;
        margin-bottom: $Footer-Height;
        padding: 0 5%;
        overflow-y: scroll;
        background-color: $Background-Color;

        &__search {
            display: flex;
            justify-content: flex-end;
            //width: calc( 100% - 80px );
            margin: 20px 40px;

            &__calendar {
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }

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
                width: 28px;
                height: 28px;
                margin: 6px 4px;
                padding: 8px 12px;
                filter: brightness($Normal-Brightness);
            }
        }

        &__timeline {
            position: fixed;
            top: calc( #{$Header-Height} + 80px );
            left: calc( #{$Timeline-Width} + 31px );
            width: calc( 100% - #{$Timeline-Width} - 90px );
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
}
</style>