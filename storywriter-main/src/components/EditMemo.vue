<template>
    <div id="edit-memo">
        <div class="controls">
            <div v-for="color in colors" :key="color"
                @click="filtering(color)"
                :style="[backgroundCss(color), selectedCss(color)]"></div>
        </div>

        <div class="memos">
            <EditMemoItem
                v-for="memo in filterMemo()" :key="memo"
                :memo="memo"
                :moveMemo="moveMemo"
                :filteringColor="filteringColor"
            />

            <div class="memos__add">
                <img src="../assets/add.png" @click="addMemo">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { StoryWrtiterViewModel } from "./story-writer-viewmodel";
import ModalMessageBox from "./util-subcomponents/ModalMessageBox.vue";
import EditMemoItem from "./edit-memo-subcomponents/EditMemoItem.vue";
import { Defs } from "./models/defs";
import { MemoItem } from "./models/memo/memos";

@Options({
    components: {
        ModalMessageBox,
        EditMemoItem
    },
    props: {
        vm: {
            type: StoryWrtiterViewModel,
            required: true
        }
    },
    methods: {
        addMemo: function(): void {
            this.vm.memos.addMemo("", this.filteringColor);
        },
        filtering: function(color: string): void {
            this.filteringColor = color;
        },
        backgroundCss: function(color: string): string {
            return `background-color: ${color};`;
        },
        selectedCss: function(color: string): string {
            if(color == this.filteringColor) {
                return `filter: brightness(1.0); border: solid 3px #FFFFFF;`;
            }
            return "";
        },
        moveMemo: function(filteredCond: string): void {
            const arg = filteredCond.split("---");
            const currentMemos = this.vm.memos.memoList.filter((x: MemoItem) => {
                return !(this.filteringColor != "transparent" && this.filteringColor != x.color);
            });
            const srcIdx = currentMemos.findIndex((x: MemoItem) => x.id == arg[0]);
            const isUp = arg[1] != 'o';

            if(isUp && srcIdx > 0) {
                this.vm.memos.swapMemo(currentMemos[srcIdx], currentMemos[srcIdx - 1]);
            } else if(!isUp && srcIdx < currentMemos.length - 1) {
                this.vm.memos.swapMemo(currentMemos[srcIdx], currentMemos[srcIdx + 1]);
            }
        },
        filterMemo: function(): MemoItem[] {
            return this.vm.memos.memoList.filter((x: MemoItem) => {
                return !(this.filteringColor != "transparent" && this.filteringColor != x.color);
            });
        }
    },
    computed: {
        colors: function(): string[] {
            const colors = this.vm.setting.darkmode
                ? Defs.definedDarkColors 
                : Defs.definedLightColors;
            const memoColors = new Array<string>();
            memoColors.push("transparent");
            colors.forEach(c => memoColors.push(c));
            return memoColors;
        },
    }
})

export default class EditMemo extends Vue {
    vm!: StoryWrtiterViewModel;

    filteringColor = "transparent";
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

$Filter-Width: 60px;
$Memo-Width: calc( #{$Menu-Width} + #{$Filter-Width} );

#edit-memo {
    @include edit-parent-base($Hierarchy-Color-Line);
    * { color: $Font-Color; }

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

    & .memos {
        position: fixed;
        top: 0;
        bottom: 0;
        left: $Memo-Width;
        width: calc( 100vw - #{$Memo-Width} - 40px );
        margin-top: $Header-Height;
        margin-bottom: $Footer-Height;
        padding: 0 5%;
        overflow-y: scroll;
        background-color: $Background-Color;

        display: flex;
        flex-direction: column;

        & * {
            width: 95%;
            padding-bottom: 15px;
            border: solid 1px $Separator-Color;
            border-radius: 8px;
            border-bottom-right-radius: 21px;
            margin-top: 35px;
            margin-bottom: 20px;
        }

        &__add {
            margin-top: 15px;
            text-align: center;
            cursor: default;
            border: none;

            & img {
                margin: 0 auto;
                width: 48px;
                height: 48px;
                cursor: pointer;
                border: none;
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
        }
    }
}
</style>