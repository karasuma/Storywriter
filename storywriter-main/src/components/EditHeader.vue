<template>
    <header>
        <ModalMessageBox
            :isVisible="showMsgBox"
            :param="message"
            :result="getResult"
        />
        <input
            style="display: none"
            ref="selectFile"
            type="file"
            accept=".ysd"
            @change="selectedFile"
        >
        <div class="actions">
            <img src="../assets/save.png" title="保存" @click="save">
            <img src="../assets/home.png" title="ホームへ戻る" @click="askHome">
            <img src="../assets/folder.png" title="読み込み" @click="askLoad">
            <img src="../assets/config.png" title="設定" @click="settingClicked">
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
import { ipcRenderer, KeyboardInputEvent } from 'electron';
import { StoryWrtiterViewModel } from './story-writer-viewmodel';
import { JsonConverter } from './models/savedata/json-converter';
import { FileAccessor } from './models/savedata/file-accessor';
import { SystemMessage } from './models/system-message';
import { Dialogs } from './models/savedata/dialogs';
import ModalMessageBox from "./util-subcomponents/ModalMessageBox.vue";
import { ISimpleFunction, MessageObject, Utils } from './models/utils';
import { Defs } from './models/defs';
import Logger from './models/logger';
import { PropType } from '@vue/runtime-core';

@Options({
    components: {
        ModalMessageBox
    },
    props: {
        vm: {
            type: StoryWrtiterViewModel,
            required: true
        },
        settingClicked: {
            type: Function as PropType<ISimpleFunction>,
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
            this.saveStory();
        },
        askHome: function() {
            if(!this.vm.editing) {
                this.home();
                return;
            }
            this.message = MessageObject.createMessage(
                "注意",
                "ホーム画面へ戻りますか？<br>" +
                "（となりのセーブボタンを押していない場合は保存されません。）"
            )
            this.state = this.msgState.Home;
            this.showMsgBox = true;
        },
        home: function() {
            this.vm.setting.showing = false;
            if(!this.vm.editing) return;
            this.vm.editing = false;
            this.vm.clear();
        },
        askLoad: function(): void {
            if(!this.vm.editing) {
                this.$refs.selectFile.click();
                return;
            }
            this.message = MessageObject.createMessage(
                "注意",
                "新しいストーリーを読み込みますか？<br>" +
                "（となりのセーブボタンを押していない場合は保存されません。）"
            )
            this.state = this.msgState.Load;
            this.showMsgBox = true;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                if(this.state == this.msgState.Home) {
                    this.home();
                } else if(this.state == this.msgState.Load) {
                    this.$refs.selectFile.click();
                }
            }
            this.showMsgBox = false;
        },
        selectedFile: function(): void {
            const e = this.$refs.selectFile as HTMLInputElement;
            if(e.files === null) return;
            const receivedFile = e.files[0];
            if(!receivedFile) return;
            if(e instanceof Event) {
                (e as Event).preventDefault();
            }
            this.$refs.selectFile.value = null;
            this.vm.loadStory(receivedFile.path);
        },
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
            return `${name.substr(0, name.lastIndexOf("."))} - Storywriter`;
        }
    }
})

export default class EditHeader extends Vue {
    vm!: StoryWrtiterViewModel;
    settingClicked!: ISimpleFunction;

    showMsgBox = false;
    message: MessageObject = MessageObject.createMessage("Warning", "");

    msgState = {
        Home: 0,
        Load: 1
    } as const;
    state: number = this.msgState.Home;

    public getNameFromPath(path: string): string {
        const result = /([^/|^\\]*)+$/g.exec(path);
        if(result !== null) {
            return result[0];
        }
        return "";
    }

    public saveStory(): void {
        if(!this.vm.editing) return;
        if(this.vm.setting.path.length == 0) {
            Dialogs.openSaveWindow(this.vm, () => this.saveStory());
            return;
        }

        const vmJson = JsonConverter.toJsonString(this.vm);
        this.vm.message.changeMessage("Saving...", SystemMessage.MessageType.Warning);
        FileAccessor.Save(this.vm.setting.path, vmJson)
            .then(result => {
                const time = Utils.getSimpleTimeStamp();
                if(result.isSuccess) {
                    this.vm.message.changeMessage(`${result.content} [${time}]`);
                    Logger.write("Story save event", `Save succeed to ${this.vm.setting.path}`, Logger.LoggingStatus.Info);
                    return;
                }
                this.vm.message.changeMessage(`Save failed... (${result.content}) [${time}]`, SystemMessage.MessageType.Alert);
                Logger.write("Story save error", result.content, Logger.LoggingStatus.Err);
            });
    }

    // Save methods used by Ctrl+S
    mounted() {
        document.addEventListener("keydown", this.saveStoryFromCtrls);
    }
    beforeDestroy() {
        document.removeEventListener("keydown", this.saveStoryFromCtrls);
    }
    public saveStoryFromCtrls(e: KeyboardEvent): void {
        if((e.ctrlKey || e.metaKey) && e.key == 's') {
            this.saveStory();
        }
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