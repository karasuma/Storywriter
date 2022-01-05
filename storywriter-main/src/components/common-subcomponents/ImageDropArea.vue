<template>
    <div class="add"
        :style="[fileHoverCss, boxSizeCss]"
        @click="addFile(getEditingWord)"
        @dragover.prevent="hoverFileDropElem(true)"
        @dragleave.prevent="hoverFileDropElem(false)"
        @drop.prevent="dropFile($event)"
    >
        <input
            style="display: none"
            ref="inputFile"
            type="file"
            :accept="accepts"
            @change="selectedFile"
        >
        <img src="../../assets/add2.png" :style="imageSize">
        <p :style="textHeight">D&D here...</p>
    </div>    
</template>

<script lang="ts">
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";
import { Word } from "../models/dictionary/word";
import { IReceiveString, Position, Utils } from "../models/utils";
import { Defs } from "../models/defs";

@Options({
    props: {
        size: {
            type: Number,
            default: 96
        },
        imageSrc: {
            type: Function as PropType<IReceiveString>,
            required: true
        },
        unfixedSize: Position
    },
    methods: {
        addFile: function(word: Word) {
            this.selectedWord = word;
            this.$refs.inputFile.click();
        },
        getFileAsBase64: function(filepath: File) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => {
                    if(e.target !== null)
                        resolve(e.target.result);
                };
                reader.onerror = err => reject(err);
                reader.readAsBinaryString(filepath);
            });
        },
        selectedFile: function() {
            const e = this.$refs.inputFile as HTMLInputElement;
            if(e.files === null) return;
            const receivedFile = e.files[0];
            e.files = null;
            if(!receivedFile || this.selectedWord === null) return;
            if(e instanceof Event) {
                (e as Event).preventDefault();
            }
            
            this.addResource(receivedFile);
        },
        dropFile: function(event: DragEvent) {
            this.hoverFileDropElem(false);
            const files = event.dataTransfer?.files;
            if(files === undefined) return;
            for (let index = 0; index < files.length; index++) {
                this.addResource(files[index]);
            }
        },
        hoverFileDropElem: function(hover: boolean) {
            this.hoveringDropArea = hover;
        },

        // Utils
        addResource: function(filepath: File) {
            this.getFileAsBase64(filepath)
                .then((bstr: string) => {
                    const b64str = btoa(bstr);
                    const src = `data:${filepath.type};base64,${b64str}`;
                    this.imageSrc(src);
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
        fileHoverCss: function(): string {
            const css = "border: dashed 3px #aaa;color:#aaa;";
            return this.hoveringDropArea ? css : "";
        },
        accepts: function(): string {
            return Defs.imageAccepts;
        },
        imageSize: function(): string {
            const size = this.getImageSize() - this.imagePadding;
            const sizeCss = `width:${size}px; height:${size}px;`;

            const fixed = Utils.isNullOrUndefined(this.unfixedSize);
            const w = fixed ? this.size : this.unfixedSize.x;
            const left = Math.max(0, (w - size) * 0.5);
            const leftCss = `position:relative;left:${left}px;`;

            const h = fixed ? this.size : this.unfixedSize.y;
            const vertMargin = Math.min(24, h * 0.5);
            const marginCss = `margin-top:${vertMargin}px;`;

            return sizeCss + leftCss + marginCss;
        },
        textHeight: function(): string {
            const fixed = Utils.isNullOrUndefined(this.unfixedSize);
            const h = fixed ? this.size : this.unfixedSize.y;
            const vertMargin = Math.min(24, h * 0.5);
            const txtsize = this.getImageSize() + this.imagePadding;
            return `height:${txtsize - vertMargin}px;`;
        }
    }
})

export default class ImageDropArea extends Vue {
    size!: number;
    imageSrc!: IReceiveString;
    unfixedSize!: Position;

    selectedWord: Word | null = null;
    hoveringDropArea = false;
    imagePadding = 8;

    public getImageSize(): number {
        const fixed = Utils.isNullOrUndefined(this.unfixedSize);
        const w = fixed ? this.size : this.unfixedSize.x;
        const h = fixed ? this.size : this.unfixedSize.y;
        const realSize = fixed ? this.size : (w < h ? w : h);
        return realSize * 0.5;
    }
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';

.add {
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

    display: flex;
    flex-direction: column;
    justify-content: center;
    & img {
        display: block;
    }
    & p {
        display: grid;
        place-items: center;
        line-height: 1.1em;
        font-family: 'Raleway';
    }
}
</style>