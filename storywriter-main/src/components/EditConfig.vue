<template>
    <div id="edit-config">
        <div class="configs">
            <div class="configs__config-row">
                <p>ダークモード</p>
                <input disabled class="checkbox" type="checkbox" v-model="vm.setting.darkmode">
            </div>
            <div class="configs__config-row">
                <p>画像の最大拡大率</p>
                <input class="range" type="range" name="expandratio"
                    v-model="vm.setting.maxImageExpandRatio"
                    min="1" max="9"
                >
                <label for="expandratio">{{ vm.setting.maxImageExpandRatio }} / 9</label>
            </div>
            <div class="configs__config-row">
                <p>画像の拡大倍率</p>
                <input class="range" type="range" name="expandpower"
                    v-model="vm.setting.imageExpandPower"
                    min="1" max="20"
                >
                <label for="expandpower">{{ vm.setting.imageExpandPower }} / 20</label>
            </div>

            <div class="configs__save">
                <div class="configs__save__button"
                    @click="saveSetting">
                    <p>更新</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { StoryWriterViewModel } from "./story-writer-viewmodel";

@Options({
    props: {
        vm: {
            type: StoryWriterViewModel,
            required: true
        }
    },
    methods: {
        selectDirectory: function(): void {
            this.$refs.selectDir.click();
        },
        selectedFile: function() {
            const e = this.$refs.selectDir as HTMLInputElement;
            if(e.files === null) return;
            const receivedFile = e.files[0];
            if(!receivedFile || this.selectedWord === null) return;
            if(e instanceof Event) {
                (e as Event).preventDefault();
            }
            
            this.vm.setting.path = receivedFile.path.replace(receivedFile.name, "");
        },
        stringEmptyCss: function(str: string): string {
            if(str.length == 0) {
                return "border: solid 1px crimson;"
            }
            return "";
        },
        saveSetting: function(): void {
            this.vm.setting.save(this.vm.message);
        }
    }
})

export default class EditConfig extends Vue {
    vm!: StoryWriterViewModel;
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

#edit-config {
    @include edit-parent-base($Hierarchy-Color-Line);
    width: calc( #{$Hierarchy-Width} + #{$Edit-Base-Width} + 40px );

    * {
        @include unselectable();
        color: $Font-Color;
    }
    & .configs {
        margin: 18px auto;
        width: calc( #{$Hierarchy-Width} + #{$Edit-Base-Width} + 4px );
        // 4px: 40px(Menu width) - 36px(horizontal margin 18px(left) + 18px(right))

        &__config-row {
            display: flex;
            & p {
                margin: 0;
                padding: 8px;
                min-width: 120px;
                font-size: 14px;
                border-right: solid 2px $Hierarchy-Color-Line;
                text-align: right;
            }
            & img {
                height: 2em;
                margin-left: 18px;
                margin-right: 6px;
                margin-top: auto;
                margin-bottom: auto;
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
                cursor: pointer;
            }
            & input {
                margin: auto 18px;
                width: 100%;
                cursor: pointer;
            }
            & .range {
                cursor: pointer;
            }
            & .text {
                height: 2em;
                border: solid 1px $Separator-Color;
                cursor: text;
            }
            & .checkbox {
                width: 1.4em;
                height: 1.4em;
                //cursor: pointer;
                cursor: not-allowed;
            }
            & label {
                min-width: 60px;
                margin-top: 0.6em;
            }
        }

        &__save {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            $Save-Height: 62px;
            height: calc( #{$Footer-Height} + #{$Save-Height} );

            display: flex;
            justify-content: flex-end;
            align-items: flex-start;

            &__button {
                margin: 4px 18px;
                padding: 2px;
                width: 70px;
                border: solid 1px $Button-Hover;
                border-radius: 12px;
                background-color: $Button-Hover;
                & p {
                    margin-top: 0.1em;
                    width: 100%;
                    text-align: center;
                    color: $Font-Reverse-Color;
                }
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
                filter: brightness($Normal-Brightness);
            }
        }
    }
}
</style>