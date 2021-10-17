<template>
    <div>
        <div class="vocab__item" :class="{ vocab__item__selected: selected }" @click="setEditStatus(word.id)">
            <h1>{{ word.caption }}</h1>
            <div class="vocab__item__desc">{{ word.description }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";
import { Word } from "../models/dictionary/word";
import { IReceiveString } from "../models/utils";

@Options({
    props: {
        word: {
            type: Word,
            required: true
        },
        setEdit: {
            type: Function as PropType<IReceiveString>,
            required: true
        }
    },
    methods: {
        setEditStatus: function(id: string) {
            this.setEdit(id);
        }
    },
    computed: {
        selected: function(): boolean {
            return this.word.editing;
        }
    }
})

export default class DictVocabItem extends Vue {
    word!: Word;
    setEdit!: IReceiveString;
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';

.vocab__item {
    margin: 2px 0;
    padding: 6px 2px;
    border-bottom: solid 1px $Separator-Color;

    & * {
        color: $Font-Color;
        cursor: pointer;
        user-select: none;
    }
    
    & h1 {
        font-size: 17px;
        width: 100%;
        margin: 0 6px;
    }
    
    &__desc {
        filter: brightness($Normal-Brightness);
        padding: 2px 4px;
        width: calc( 100% - 8px );
        font-size: 12px;
        height: 16px;
        @include hide-overflow-text();
    }

    &:hover {
        background-color: $Hover-Color;
    }

    opacity: 0.7;
    &__selected {
        opacity: 1;
        border-left: solid 3px $Selected-Item-Color;
        width: calc( 100% - 6px );
    }
}
</style>