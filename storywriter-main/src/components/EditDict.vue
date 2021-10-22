<template>
    <div id="edit-dict">
        <ModalMessageBox
            :isVisible="showMsgBox"
            :param="message"
            :result="getResult"
        />

        <div class="vocabs">
            <DictVocabItem v-for="item in vm.dictionary.words" :key="item" :word="item" :setEdit="changeEdit" />

            <div class="vocabs__add">
                <img src="../assets/add2.png" @click="addWord">
            </div>
        </div>

        <div class="edit">
            <div v-if="hasEditingWord" class="edit__content">
                <div class="edit__content__header">
                    <input type="text" maxlength="64" spellcheck="false" v-model="getEditingWord.caption">
                    <div class="edit__content__header-ctrl">
                        <img src="../assets/dispose.png" @click="askDispose(getEditingWord)">
                    </div>
                </div>

                <div class="edit__content__note">
                    <textarea v-model="getEditingWord.description"
                        :maxlength="maxDescLength" spellcheck="false" placeholder="..."></textarea>
                    <div class="edit__content__note-count">
                        {{ getEditingWord.description.length }}/{{ maxDescLength }}
                    </div>
                </div>

                <h2>Resources</h2>
                <div class="edit__content__images">
                    <ImageItem v-for="img in getEditingWord.resources"
                        :key="img" :file="img"
                        :dispose="deleteResource"
                        :expandRatio="vm.setting.maxImageExpandRatio"
                        :expandPower="vm.setting.imageExpandPower"
                    />
                    <ImageDropArea
                        :imageSrc="addImageSource"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Word } from "./models/dictionary/word";
import DictVocabItem from "./edit-dict-subcomponents/DictVocabItem.vue";
import ImageItem from "./common-subcomponents/ImageItem.vue";
import ModalMessageBox from "./util-subcomponents/ModalMessageBox.vue";
import { MessageObject } from "./models/utils";
import { Defs } from "./models/defs";
import { StoryWrtiterViewModel } from "./story-writer-viewmodel";
import ImageDropArea from "./common-subcomponents/ImageDropArea.vue";

@Options({
    components: {
        DictVocabItem,
        ModalMessageBox,
        ImageItem,
        ImageDropArea
    },
    props: {
        vm: {
            type: StoryWrtiterViewModel,
            required: true
        }
    },
    methods: {
        changeEdit: function(id: string) {
            this.vm.dictionary.changeEditingWord(id);
        },
        addWord: function() {
            this.vm.dictionary.appendNewWord("new word");
        },
        askDispose: function(word: Word) {
            this.message = MessageObject.createMessage(
                "Warning",
                    "Are you sure you want to remove<br>"
                        + '<b style="padding: 0 3px; font-size: 16px;">'
                        + "' " + word.caption + " '"
                        + "</b>"
                    + " ?",
                true
            );
            this.showMsgBox = true;
            this.deleteTargetId = word.id;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                this.vm.dictionary.removeWord(this.deleteTargetId);
            }
            this.deleteTargetId = "";
            this.showMsgBox = false;
        },
        deleteResource: function(id: string) {
            this.getEditingWord.removeResource(id);
        },
        addImageSource: function(src: string): void {
            this.getEditingWord.addResource(src);
        }
    },
    computed: {
        getEditingWord: function(): Word | undefined {
            return this.vm.dictionary.words.find((x: Word) => x.editing);
        },
        hasEditingWord: function(): boolean {
            return this.getEditingWord !== undefined;
        },
        fileHoverCss: function(): string {
            const css = "border: dashed 3px #aaa;color:#aaa;";
            return this.hoveringDropArea ? css : "";
        }
    }
})

export default class EditDict extends Vue {
    vm!: StoryWrtiterViewModel;

    maxDescLength: number = 500;

    showMsgBox: boolean = false;
    message: MessageObject = MessageObject.createMessage("", "");
    deleteTargetId: string = "";

    selectedWord: Word | null = null;
    hoveringDropArea: boolean = false;
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

#edit-dict {
    position: fixed;
    top: $Header-Height;
    bottom: $Footer-Height;
    left: calc( #{$Menu-Width} + 1px );
    border-left: solid 1px $Hierarchy-Color-Line;
    & * { color: $Font-Color; }

    & .vocabs {
        @include hierarchy-base($Background-Color-Hierarchy);

        &__add {
            margin-top: 15px;
            width: 100%;
            text-align: center;
            cursor: default;

            & img {
                margin: 0 auto;
                width: 24px;
                height: 24px;
                cursor: pointer;
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
        }
    }

    & .edit {
        @include edit-base($Background-Color);

        &__content {
            margin: 32px;

            &__header {
                display: flex;

                &-ctrl {
                    display: flex;
                    flex-direction: row-reverse;
                    margin: auto 0;
                }
                &-ctrl * {
                    font-size: 1.6em;
                    text-align: center;
                    width: 28px;
                    height: 28px;
                    cursor: pointer;
                    user-select: none;
                    margin-left: 12px;
                    filter: brightness($Normal-Brightness);
                    &:hover {
                        filter: brightness($Focus-Brightness);
                    }
                }

                & input {
                    border: none;
                    border-bottom: solid 1px $Separator-Color;
                    border-radius: 0;
                    font-size: 27px;
                    font-weight: bold;
                    width: 100%;
                    &:hover {
                        border-bottom: solid 1px $Font-Selected-Color;
                    }
                }
            }

            &__note {
                margin: 12px 0;
                height: 40vh;

                & textarea {
                    margin: 0;
                    height: 100%;
                    resize: none;
                }

                &-count {
                    width: 100%;
                    text-align: right;
                }
            }

            & h2 {
                font-size: 21px;
                margin: 6px 0;
            }

            &__images {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;

                &-add {
                    width: 96px;
                    height: 96px;
                    margin: 3px 5px;
                    border-radius: 8px;
                    cursor: pointer;
                    user-select: none;
                    border: solid 1px $Separator-Color;

                    filter: brightness($Normal-Brightness);
                    &:hover {
                        filter: brightness($Focus-Brightness);
                    }

                    & * {
                        pointer-events: none;
                    }

                    & img {
                        width: 40px;
                        height: 40px;
                        position: relative;
                        top: 15px;
                        left: 25px;
                    }
                    & p {
                        text-align: center;
                        line-height: 1.1em;
                        margin: 1em 0;
                        height: 3em;
                        font-family: 'Raleway';
                    }
                }
            }
        }
    }
}
</style>