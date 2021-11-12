<template>
    <header>
        <div class="actions">
            <img src="../assets/save.png" @click="save">
            <img src="../assets/home.png" @click="home">
        </div>
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
import { StoryWrtiterViewModel } from './story-writer-viewmodel';
import { JsonConverter } from './models/savedata/json-converter';
import { FileAccessor } from './models/savedata/file-accessor';
import { SystemMessage } from './models/system-message';
import { Dialogs } from './models/savedata/dialogs';

@Options({
    props: {
        vm: {
            type: StoryWrtiterViewModel,
            required: true
        }
    },
    methods: {
        exit: function() {
            window.close();
        },
        minimize: function() {
            ipcRenderer.send('minimize', true);
        },
        maximize: function() {
            ipcRenderer.send('maximize', true);
        },
        save: function() {
            if(!this.vm.editing) return;
            if(this.vm.setting.path.length == 0) {
                Dialogs.openSaveWindow(this.vm, () => this.saveStory());
                return;
            }
            this.saveStory();
        },
        home: function() {
            if(!this.vm.editing) return;
            this.vm.editing = false;
        }
    },
    computed: {
        title: function(): string {
            if(!this.vm.editing) {
                return "Storywriter";
            }
            const result = this.getNameFromPath(this.vm.setting.path);
            let name = "Untitled";
            if(result.length != 0) {
                name = result;
            }
            return `${name} - Storywriter`;
        }
    }
})

export default class EditHeader extends Vue {
    vm!: StoryWrtiterViewModel;

    public getNameFromPath(path: string): string {
        const result = /([^/|^\\]*)+$/g.exec(path);
        if(result !== null) {
            return result[0];
        }
        return "";
    }

    public saveStory(): void {
        const vmJson = JsonConverter.toJsonString(this.vm);
        this.vm.message.changeMessage("Saving...", SystemMessage.MessageType.Warning);
        FileAccessor.Save(this.vm.setting.path, vmJson)
            .then(result => {
                if(result.isSuccess) {
                    this.vm.message.changeMessage(`${result.content}`);
                    return;
                }
                this.vm.message.changeMessage(`Save failed... (${result.content})`, SystemMessage.MessageType.Alert);
            });
    }
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
        margin: 1px 4px;
        filter: brightness($Normal-Brightness);
    }
    & img:hover {
        filter: brightness($Focus-Brightness);
    }

    & .actions {
        display: flex;
        height: $Header-Height;
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