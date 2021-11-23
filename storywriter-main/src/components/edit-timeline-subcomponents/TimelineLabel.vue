<template>
    <div class="timeline__item" :style="itemPropStyle">
        <p>{{ story.content.caption }}</p>
    </div>    
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Defs } from "../models/defs";
import { Stories } from "../models/story/stories";
import { Utils } from "../models/utils";

@Options({
    props: {
        story: {
            type: Stories,
            required: true
        },
        span: {
            type: Number,
            default: 55
        },
        indent: {
            type: Number,
            default: 20
        },
        darkmode: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        itemPropStyle: function(): string {
            const pos = this.getPositionCss();
            const top = "top: " + pos[0];
            const left = "left: " + pos[1];
            const col = this.getColorCss();
            const border = "border-left: " + col[0];
            const shadow = "box-shadow: " + col[1];
            const misc = "position: absolute;";
            return misc + top + left + border + shadow;
        }
    }
})

export default class TimelineLabel extends Vue {
    story!: Stories;
    span!: number;
    indent!: number;
    darkmode!: boolean;

    rmargin: number = Math.random() * 10;

    public getPositionCss(): [string, string] {
        const cols = this.darkmode ? Defs.definedLightColors : Defs.definedDarkColors;
        const top = "calc(" + (this.span * this.story.content.time + this.rmargin) + "px + 3em);";
        const left = "calc(60px + " + (cols.indexOf(this.story.content.color) * this.indent) + "px);";
        return [top, left];
    }

    public getColorCss(): [string, string] {
        const rgb = Utils.hex2rgb(this.story.content.color).map(c => Math.max(0, c * 0.4));
        const shadow = "4px 3px 1px rgb(" + rgb.join(", ") + ");";
        const border = "solid 3px " + this.story.content.color + ";";
        return [border, shadow];
    }
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';

.timeline__item {
    width: 300px;
    padding: 0 12px;
    background-color: $Background-Color-Panel;
    cursor: pointer;
    & p {
        color: $Font-Color;
        font-size: 14px;
        width: 100%;
        height: 2em;
        line-height: 2em;
        @include hide-overflow-text();
    }
}
</style>