<template>
    <div id="edit-actor">
        <ModalMessageBox
            :isVisible="showMsgBox"
            :param="message"
            :result="getResult"
        />

        <div class="actors">
            <ActorListItem v-for="actor in vm.actors.actors" :key="actor"
                :name="actor.name" :face="actor.face.content" :selected="actor.editing"
                @click="setEditing(actor.id)"
            />
            <div class="actors__add">
                <img src="../assets/add2.png" @click="addNewActor">
            </div>
        </div>

        <div class="edit">
            <div v-if="isEditing">
                <img class="edit__dispose"
                    src="../assets/dispose.png"
                    @click="dispose(getEditingActor.id)">

                <div class="edit__title">
                    <ImageDropArea v-if="isEmpty(getEditingActor.face.content)"
                        :imageSrc="addCaptionImage"
                        :size="160"
                        class="edit__title__image"
                    />
                    <ImageItem v-else
                        :file="getEditingActor.face"
                        :dispose="deleteCaption"
                        :size="160"
                        :expandRatio="vm.setting.maxImageExpandRatio"
                        :expandPower="vm.setting.imageExpandPower"
                        class="edit__title__image"
                    />
                    <input type="text" spellcheck="false" v-model="getEditingActor.name">
                </div>

                <div class="edit__contents">
                    <div class="edit__contents__images">
                        <ImageItem v-for="img in getEditingActor.images"
                            :key="img" :file="img"
                            :dispose="deleteImageSource"
                            :expandRatio="vm.setting.maxImageExpandRatio"
                            :expandPower="vm.setting.imageExpandPower"
                        />
                        <ImageDropArea
                            :imageSrc="addImageSource"
                        />
                    </div>

                    <div class="edit__contents__details">
                        <h2>紹介</h2>
                        <textarea
                            v-model="getEditingActor.introduce" 
                            maxlength="500" spellcheck="false" placeholder="..."></textarea>
                        <h2>詳しい情報</h2>
                        <textarea
                            v-model="getEditingActor.detail"
                            maxlength="500" spellcheck="false" placeholder="..."></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ActorItem } from "./models/actor/actor-item";
import ActorListItem from "./edit-actor-subcomponents/ActorListItem.vue";
import { StoryWrtiterViewModel } from "./story-writer-viewmodel";
import ImageItem from "./common-subcomponents/ImageItem.vue";
import ImageDropArea from "./common-subcomponents/ImageDropArea.vue";
import ModalMessageBox from "./util-subcomponents/ModalMessageBox.vue";
import { MessageObject } from "./models/utils";
import { Defs } from "./models/defs";

@Options({
    components: {
        ImageItem,
        ImageDropArea,
        ModalMessageBox,
        ActorListItem
    },
    props: {
        vm: {
            type: StoryWrtiterViewModel,
            required: true
        }
    },
    methods: {
        addNewActor: function(): void {
            this.vm.actors.createNewActor("");
        },
        isEmpty: function(str: string): boolean {
            return str.length == 0;
        },
        deleteCaption: function(_: string): void {
            this.getEditingActor.face.content = "";
        },
        deleteImageSource: function(id: string) {
            this.getEditingActor.removeImage(id);
        },
        addImageSource: function(src: string): void {
            this.getEditingActor.addImage(src);
        },
        addCaptionImage: function(src: string): void {
            this.getEditingActor.face.content = src;
        },
        setEditing: function(id: string): void {
            const target = this.vm.actors.actors.find((a: ActorItem) => a.id == id);
            this.vm.actors.actors.forEach((actor: ActorItem) => {
                actor.editing = false;
            });
            target.editing = true;
        },
        dispose: function(id: string): void {
            this.message = MessageObject.createMessage(
                "警告",
                    "このキャラクターを削除しますか？<br>"
                        + '<b style="padding: 0 3px; font-size: 16px;">'
                        + "' " + this.getEditingActor.name + " '"
                        + "</b>",
                true
            );
            this.showMsgBox = true;
            this.deleteTargetId = id;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                const idx = this.vm.actors.actors
                    .findIndex((x: ActorItem) => x.id == this.deleteTargetId);
                if(idx >= 0) {
                    this.vm.actors.actors.splice(idx, 1);
                }
            }
            this.deleteTargetId = "";
            this.showMsgBox = false;
        },
    },
    computed: {
        getEditingActor: function(): ActorItem | undefined {
            return this.vm.actors.actors.find((a: ActorItem) => a.editing);
        },
        isEditing: function(): boolean {
            return this.getEditingActor !== undefined;
        },
    }
})

export default class EditActor extends Vue {
    vm!: StoryWrtiterViewModel;
    
    showMsgBox = false;
    message: MessageObject = MessageObject.createMessage("", "");
    deleteTargetId = "";
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

#edit-actor {
    @include edit-parent-base($Hierarchy-Color-Line);
    * { color: $Font-Color; }

    .actors {
        @include hierarchy-base($Background-Color-Hierarchy);

        & * {
            cursor: pointer;
            user-select: none;
        }
            
        &__add {
            margin-top: 15px;
            width: 100%;
            text-align: center;
            cursor: default;

            & img {
                margin: 0 auto;
                width: 24px;
                height: 24px;
                filter: brightness($Normal-Brightness);
                cursor: pointer;
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
        }
    }

    .edit {
        @include edit-base($Background-Color);

        &__dispose {
            position: fixed;
            top: calc( #{$Header-Height} + 32px );
            right: 42px;
            width: 32px;
            height: 32px;
            filter: brightness($Normal-Brightness);
            cursor: pointer;
            &:hover {
                filter: brightness($Focus-Brightness);
            }
        }

        &__title {
            width: 100%;
            height: 25vh;
            display: flex;

            &__image {
                width: 160px;
                height: 160px;
                margin: auto 48px;
                border-radius: 16px;
            }

            & input {
                border: none;
                border-bottom: solid 1px $Separator-Color;
                border-radius: 0;
                font-size: 32px;
                font-weight: bold;
                width: calc( 100% - 256px - 40px );
                margin: auto 0;
                height: 2em;
                &:focus {
                    border-bottom: solid 1px $Font-Selected-Color;
                }
            }
        }

        &__contents {
            margin-top: 30px;
            padding-top: 30px;
            border-top: solid 1px $Separator-Color;
            display: flex;
            width: 100%;

            & p {
                font-size: 12px;
                text-align: center;
                line-height: 1.1em;
                margin: 0;
                position: absolute;
                bottom: 5px;
                left: 0;
                height: 28px;
            }

            &__images {
                width: 240px;
                min-width: 240px;
                height: 58vh;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
                justify-content: flex-start;
                overflow-y: scroll;

                & * {
                    width: 96px;
                    height: 96px;
                    margin: 7px;
                    border-radius: 8px;
                    object-fit: cover;
                    cursor: pointer;
                    user-select: none;

                }
            }

            &__details {
                width: 100%;
                height: 58vh;
                padding: 0 20px;
                overflow-y: scroll;

                & h2 {
                    font-size: 21px;
                }

                & textarea {
                    margin-bottom: 20px;
                    height: 6em;
                }
            }
        }
    }
}
</style>