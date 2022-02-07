<template>
    <div id="entrance">
        <img class="background" src="../assets/edit.png">

        <div class="button create" @click="newGame">
            <div class="button__image">
                <img src="../assets/add-file.png">
            </div>
            <p>初めから</p>
        </div>
        <div class="button load" @click="continueGame">
            <div class="button__image">
                <img src="../assets/folder.png">
            </div>
            <input
                style="display: none"
                ref="selectFile"
                type="file"
                accept=".ysd"
                @change="selectedFile"
            >
            <p>途中から</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { StoryWriterViewModel } from './story-writer-viewmodel';

@Options({
    props: {
        vm: {
            type: StoryWriterViewModel,
            required: true
        }
    },
    methods: {
        newGame: function(): void {
            this.vm.loadDefaultStories();
            this.vm.editing = true;
            this.vm.history.Update(this.vm);
        },
        continueGame: function(): void {
            this.$refs.selectFile.click();
        },
        selectedFile: function(): void {
            const e = this.$refs.selectFile as HTMLInputElement;
            if(e.files === null) return;
            const receivedFile = e.files[0];
            if(!receivedFile || this.selectedWord === null) return;
            if(e instanceof Event) {
                (e as Event).preventDefault();
            }
            
            this.vm.loadStory(receivedFile.path);
            this.vm.history.Update(this.vm);
        },
    }
})

export default class Entrance extends Vue {
    vm!: StoryWriterViewModel;
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

#entrance {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: $Header-Height;
    margin-bottom: $Footer-Height;
    background-color: $Background-Color;
    
    * {
        @include unselectable();
        color: $Font-Color;
    }

    & .background {
        z-index: $Normal-ZIndex;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 300px;
        height: 300px;
        filter: blur(4px) brightness(0.4);
    }
    
    display: flex;
    justify-content: center;
    align-items: center;
    & .button {
        z-index: $Front-ZIndex;
        $Button-Width: 300px;
        width: $Button-Width;
        height: $Button-Width;
        border-radius: 18px;
        margin: auto 5%;

        filter: brightness($Normal-Brightness);
        border: solid 3px $Hierarchy-Color-Line;
        &:hover {
            filter: brightness($Focus-Brightness);
        }

        display: flex;
        flex-direction: column;
        align-items: center;
        &__image {
            flex-grow: 2;
            display: grid;
            place-items: center;
            width: 100%;
            & img {
                height: 75%;
                filter: blur(1px);
            }
            &:before {  
                padding-top: 100%;
            }
        }
        & p {
            flex-grow: 1;
            display: grid;
            place-items: center;
            line-height: 1em;
            font-size: 21px;
            font-family: 'Raleway';
        }
    }

    & .create {
        &:hover {
            border: solid 3px $Selected-Item-Color;
        }
    }

    & .load {
        &:hover {
            border: solid 3px $Selected-Border-Color;
        }
    }
}
</style>