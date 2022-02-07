<template>
    <div id="edit-world">
        <ModalMessageBox
            :isVisible="showMsgBox"
            :param="message"
            :result="getResult"
        />
        <ModalSimpleInputBox
            :isVisible="showInputBox"
            :result="getResultInput"
            :caption="inputCaption"
            :defaultText="defaultText"
        />
        <div class="hierarchy">
            <ul class="hierarchy__list">
                <EditWorldHierarchyItem
                    v-for="world in vm.worlds.worldGroups" :key="world"
                    :vm="vm"
                    :world="world"
                    :resetEditFlags="resetEditFlags"
                />
            </ul>
            <div class="hierarchy__add">
                <img src="../assets/add2.png" @click="addWorldGroup">
            </div>
        </div>

        <div class="edit">
            <div v-if="hasSelectedCountry">
                <div class="edit__header">
                    <img class="edit__header__dispose"
                        src="../assets/dispose.png"
                        @click="removeCountry">
                    <input id="countryName" type="text" spellcheck="false"
                        v-model="getSelectedCountry.name">
                    <ImageDropArea v-if="isEmpty(getSelectedCountry.image.content)"
                        :imageSrc="addCaptionImage"
                        :unfixedSize="captionSize"
                        class="edit__header__image"
                    />
                    <ImageItem v-else
                        :file="getSelectedCountry.image"
                        :dispose="deleteCaption"
                        :unfixedSize="captionSize"
                        :expandRatio="vm.setting.maxImageExpandRatio"
                        :expandPower="vm.setting.imageExpandPower"
                        class="edit__header__image"
                    />
                </div>

                <div class="edit__contents">
                    <div class="edit__contents__images">
                        <ImageItem v-for="img in getSelectedCountry.samples"
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
                        <h2>説明</h2>
                        <textarea id="countryDescription" type="text" spellcheck="false"
                            placeholder="..."
                            v-model="getSelectedCountry.description">
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { StoryWriterViewModel } from "./story-writer-viewmodel";
import EditWorldHierarchyItem from "./edit-world.subcomponents/EditWorldHierarchyItem.vue";
import ImageItem from "./common-subcomponents/ImageItem.vue";
import ImageDropArea from "./common-subcomponents/ImageDropArea.vue";
import ModalMessageBox from "./util-subcomponents/ModalMessageBox.vue";
import ModalSimpleInputBox from "./util-subcomponents/ModalSimpleInputBox.vue";
import { World, Worlds } from "./models/world/worlds";
import { Country } from "./models/world/country";
import { MessageObject, Position } from "./models/utils";
import { Defs } from "./models/defs";

@Options({
    components: {
        ModalMessageBox,
        ModalSimpleInputBox,
        ImageDropArea,
        ImageItem,
        EditWorldHierarchyItem
    },
    props: {
        vm: {
            type: StoryWriterViewModel,
            required: true
        }
    },
    methods: {
        isEmpty: function(text: string): boolean {
            return text.length == 0;
        },
        resetEditFlags: function(): void {
            this.vm.worlds.worldGroups.forEach((w: World) => {
                w.countries.forEach(c => {
                    c.editing = false;
                });
            });
        },
        addCaptionImage: function(src: string): void {
            this.getSelectedCountry.image.content = src;
            this.vm.history.Update(this.vm);
        },
        deleteCaption: function(_: string): void {
            this.getSelectedCountry.image.content = "";
            this.vm.history.Update(this.vm);
        },
        addImageSource: function(src: string): void {
            this.getSelectedCountry.addSample(src);
            this.vm.history.Update(this.vm);
        },
        deleteImageSource: function(id: string): void {
            this.getSelectedCountry.removeSample(id);
            this.vm.history.Update(this.vm);
        },
        addWorldGroup: function(): void {
            this.showInputBox = true;
        },
        getResultInput: function(text: string): void {
            if(text.length > 0) {
                this.vm.worlds.addWorld(text);
                this.vm.history.Update(this.vm);
            }
            this.showInputBox = false;
        },
        removeCountry: function(_: string): void {
            this.message = MessageObject.createMessage(
                "警告",
                    "このエリアを削除しますか？<br>"
                        + '<b style="padding: 0 3px; font-size: 16px;">'
                        + "' " + this.getSelectedCountry.name + " '"
                        + "</b>",
                true
            );
            this.showMsgBox = true;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                this.getSelectedCountry.deleteMe();
                this.vm.history.Update(this.vm);
            }
            this.showMsgBox = false;
        },
    },
    computed: {
        getSelectedCountry: function(): Country | null {
            const editing = this.vm.worlds.worldGroups.find((w: World) => {
                return w.getEditingCountry() instanceof Country;
            })?.getEditingCountry();
            if(editing !== undefined) {
                return editing;
            }
            return this.dummyCountry;
        },
        hasSelectedCountry: function(): boolean {
            const editing = this.vm.worlds.worldGroups.find((w: World) => {
                return w.getEditingCountry() instanceof Country;
            })?.getEditingCountry();
            return editing !== undefined;
        },
        accepts: function(): string {
            return Defs.imageAccepts;
        }
    }
})

export default class EditWorld extends Vue {
    vm!: StoryWriterViewModel;

    showInputBox = false;
    inputCaption = "土地の追加";
    defaultText = "";
    
    dummyCountry: Country = new Country("", new World("", new Worlds()));

    showMsgBox = false;
    message: MessageObject = MessageObject.createMessage("","");

    captionSize: Position = new Position(0,0);
    public cwidth(): number {
        const defaultWidth = window.innerWidth - 265; // 265: Default edit width
        const me = document.getElementById("edit-world");
        if(me === null) return defaultWidth;
        const cw = me.getElementsByClassName("edit");
        if(cw.length > 0) {
            const w = cw[0].clientWidth;
            return w == 0 ? defaultWidth : w;
        }
        return defaultWidth;
    }
    public setCaptionSize(): void {
        const clientWidth = this.cwidth();
        this.captionSize.x = Math.max(120, Math.round(clientWidth - 120));
        this.captionSize.y = 230;
    }
    
    registerTextareas() {
        const onFocus = () => {
            this.vm.textEdting = true;
        };
        const onBlur = () => {
            this.vm.textEdting = false;
            this.vm.history.Update(this.vm);
        };
        const registerAttribute = ["registered", "attached"];
        const inputElem = document.getElementById("countryName");
        if(inputElem !== null && inputElem.getAttribute(registerAttribute[0]) !== registerAttribute[1]) {
            inputElem.onfocus = onFocus;
            inputElem.onblur = onBlur;
            inputElem.setAttribute(registerAttribute[0], registerAttribute[1]);
        }
        const textareaElem = document.getElementById("countryDescription");
        if(textareaElem !== null && textareaElem.getAttribute(registerAttribute[0]) !== registerAttribute[1]) {
            textareaElem.onfocus = onFocus;
            textareaElem.onblur = onBlur;
            textareaElem.setAttribute(registerAttribute[0], registerAttribute[1]);
        }
    }

    mounted() {
        window.addEventListener("resize", this.setCaptionSize, false);
        this.setCaptionSize();
        this.registerTextareas();
    }
    updated() {
        this.registerTextareas();
    }
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';


#edit-world {
    @include edit-parent-base($Hierarchy-Color-Line);
    * { color: $Font-Color; }

    & .hierarchy {
        @include hierarchy-base($Background-Color-Hierarchy);

        &__list {
            list-style-type: none;
            padding: 0 4px;
        }
        &__add {
            width: 100%;
            & img {
                display: block;
                width: 26px;
                height: 26px;
                margin: 8px auto;
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
        }
    }

    & .edit {
        @include edit-base($Background-Color);

        &__header {
            width: 100%;
            height: 340px;
            margin-bottom: 15px;
            border-bottom: solid 1px $Separator-Color;
            &__dispose {
                position: fixed;
                top: calc( #{$Header-Height} + 20px );
                right: 20px;
                width: 38px;
                height: 38px;
                cursor: pointer;
                filter: brightness($Normal-Brightness);
                &:hover {
                    filter: brightness($Focus-Brightness);
                }
            }
            & input {
                display: block;
                border: none;
                border-bottom: solid 1px $Separator-Color;
                border-radius: 0;
                font-size: 32px;
                font-weight: bold;
                width: 70%;
                margin: 16px auto;
                height: 2em;
                text-align: center;
                &:focus {
                    border-bottom: solid 1px $Font-Selected-Color;
                }
            }
            &__image {
                display: block;
                width: calc( #{$Edit-Base-Width} - 60px );
                height: 230px;
                margin: 20px auto;
                object-fit: cover;
                border-radius: 24px;
            }
        }

        &__contents {
            width: 100%;
            height: 40vh;
            display: flex;
            &__images {
                width: 240px;
                min-width: 240px;
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
                justify-content: flex-start;
                overflow-y: scroll;
            }
            &__details {
                width: 100%;
                height: 90%;
                padding: 0 20px;
                & h2 {
                    font-size: 21px;
                    margin-left: 10px;
                }
                & textarea {
                    margin: 3px 8px;
                    width: calc( 100% - 17px );
                    height: 16em;
                }
            }
        }
    }
}
</style>