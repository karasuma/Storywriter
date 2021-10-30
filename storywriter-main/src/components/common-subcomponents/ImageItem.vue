<template>
    <div class="reswrapper" :style="boxSizeCss">
        <ModalMessageBox
            :isVisible="showMsgBox"
            :param="message"
            :result="getResult"
        />
        <ImageViewer
            :isVisible="showImgViewer"
            :src64="file.content"
            :close="closeViewer"
        />
        <input
            style="display: none"
            ref="inputFile"
            type="file"
            :accept="accepts"
            @change="selectedFile"
        >
        <p @click="askDispose(file.id)">&times;</p>
        <div class="reswrapper__reload" @click="addFile">
            <img src="../../assets/change.png">
        </div>
        <img class="reswrapper__image" @click="showViewer" :src="file.content">
    </div>
</template>

<script lang="ts">
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";
import { Defs } from "../models/defs";
import { IReceiveString, MessageObject, ImageResource, Utils, Position } from "../models/utils";
import ModalMessageBox from "../util-subcomponents/ModalMessageBox.vue";
import ImageViewer from "../util-subcomponents/ImageViewer.vue";

@Options({
    components: {
        ModalMessageBox,
        ImageViewer
    },
    props: {
        file: {
            Type: ImageResource,
            default: null,
            required: true
        },
        dispose: {
            Type: Function as PropType<IReceiveString>,
            required: true
        },
        size: {
            Type: Number,
            default: 96
        },
        unfixedSize: Position
    },
    methods: {
        askDispose: function(id: string) {
            this.deleteTargetId = id;
            this.showMsgBox = true;
        },
        getResult: function(result: number) {
            if(result == Defs.MessageType.Confirm) {
                this.dispose(this.deleteTargetId);
            }
            this.deleteTargetId = "";
            this.showMsgBox = false;
        },
        showViewer: function() {
            if(this.file.content.length > 0) {
                this.showImgViewer = true;
            }
        },
        closeViewer: function() {
            this.showImgViewer = false;
        },

        // File input methods
        addFile: function(): void {
            this.$refs.inputFile.click();
        },
        selectedFile: function(): void {
            const e = this.$refs.inputFile as HTMLInputElement;
            if(e.files === null) return;
            const receivedFile = e.files[0];
            if(!receivedFile || !(receivedFile instanceof File)) return;
            if(e instanceof Event) {
                (e as Event).preventDefault();
            }
            this.addResource(receivedFile);
        },
        addResource: function(filepath: File): void {
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => {
                    if(e.target !== null)
                        resolve(e.target.result);
                };
                reader.onerror = err => reject(err);
                reader.readAsBinaryString(filepath);
            })
            .then((bstr: string | unknown) => {
                    if(typeof bstr == 'string') {
                        const b64str = btoa(bstr);
                        const src = `data:${filepath.type};base64,${b64str}`;
                        this.file.content = src;
                    }
            });
        }
    },
    computed: {
        boxSizeCss: function(): string {
            if(Utils.isNullOrUndefined(this.unfixedSize)) {
                const size = this.size < 1 ? 96 : this.size;
                return `width:${size}px; height:${size}px;`;
            }
            return `width:${this.unfixedSize.x}px; height:${this.unfixedSize.y}px;`;
        },
        accepts: function(): string {
            return Defs.imageAccepts;
        }
    }
})

export default class ImageItem extends Vue {
    file!: ImageResource;
    dispose!: IReceiveString;
    size!: number;
    unfixedSize!: Position;

    showMsgBox: boolean = false;
    message: MessageObject = MessageObject.createMessage(
                "消すよ？",
                "この画像を除きますか？",
                true
            );
    deleteTargetId: string = "";

    showImgViewer: boolean = false;
}
</script>

<style lang="scss" scoped>
@import '../templates/common.scss';
@import '../templates/darktheme.scss';

$Close-Size: 28px;

.reswrapper {
    position: relative;
    //width: 96px;
    //height: 96px;
    margin: 3px 5px;

    & * {
        cursor: pointer;
        user-select: none;
    }

    & p {
        position: absolute;
        right: 4px;
        top: 4px;
        width: $Close-Size;
        height: $Close-Size;
        border-radius: 14px;
        background-color: $Background-Color;
        font-size: $Close-Size;
        text-align: center;
        line-height: 0.8em;
        z-index: calc($Normal-ZIndex + 3);
        
        filter: brightness($Normal-Brightness);
        &:hover {
            filter: brightness($Focus-Brightness);
        }
    }

    &__reload {
        position: absolute;
        right: 4px;
        top: 34px;
        width: $Close-Size;
        height: $Close-Size;
        border-radius: 14px;
        background-color: $Background-Color;
        z-index: calc($Normal-ZIndex + 2);
        & img {
            width: calc( #{$Close-Size} - 8px );
            height: calc( #{$Close-Size} - 8px );
            margin: 4px;
        }
        
        filter: brightness($Normal-Brightness);
        &:hover {
            filter: brightness($Focus-Brightness);
        }
    }

    &__image {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        z-index: calc($Normal-ZIndex + 2);
    }
}
</style>