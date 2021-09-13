<template>
    <header>
        <img src="../assets/save.png">
        <div class="title">{{ title }}</div>
        <div class="controls">
            <span class="controls__minimum" @click="minimize">－</span>
            <span class="controls__maximum" @click="maximize">□</span>
            <span class="controls__close" @click="exit">×</span>
        </div>
    </header>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ipcRenderer } from 'electron';

@Options({
    props: {
        title: {
            type: String,
            default: "Story Writer Beta"
        }
    },
    methods: {
        exit: function() {
            window.close();
        },
        minimize: function() {
            ipcRenderer.send('minimize', true)
        },
        maximize: function() {
            ipcRenderer.send('maximize', true)
        }
    }
})

export default class EditHeader extends Vue {
    title!: String
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

header {
    color: $Font-Color;
    text-align: center;
    border-bottom: solid 1px $Separator-Color;
    display: flex;
    justify-content: right;
    background-color: #141414;
    height: $Header-Height;

    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: $Front-ZIndex;
    user-select: none;

    & img {
        padding: 4px;
        margin: 4px;
        filter: brightness($Normal-Brightness);
    }
    & img:hover {
        filter: brightness($Focus-Brightness);
    }

    & .title {
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        font-size: 12px;
        
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-app-region: drag;
    }

    & .controls {
        width: 140px;
        font-weight: bold;
        display: flex;
        justify-content: flex-end;

        & span {
            font-size: 16px;
            width: 51px;
            line-height: 34px;
            color: white;
            cursor: default;
        }
        &__maximum:hover, &__minimum:hover {
            background-color: $Hover-Color;
        }

        &__close:hover {
            background-color: crimson;
        }
    }
}
</style>