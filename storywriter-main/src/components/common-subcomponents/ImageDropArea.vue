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
            accept="image/jpeg, image/jpg, image/png"
            @change="selectedFile"
        >
        <img src="../../assets/add2.png">
        <p>D&D here...</p>
    </div>    
</template>

<script lang="ts">
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";
import { Word } from "../models/dictionary/word";
import { IReceiveString } from "../models/utils";

@Options({
    props: {
        size: {
            type: Number,
            default: 96
        },
        imageSrc: {
            type: Function as PropType<IReceiveString>,
            required: true
        }
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
            const size = this.size < 1 ? 96 : this.size;
            return `width:${size}px; height:${size}px;`;
        },
        fileHoverCss: function(): string {
            const css = "border: dashed 3px #aaa;color:#aaa;";
            return this.hoveringDropArea ? css : "";
        }
    }
})

export default class ImageDropArea extends Vue {
    size!: number;
    imageSrc!: IReceiveString;

    selectedWord: Word | null = null;
    hoveringDropArea: boolean = false;
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
</style>