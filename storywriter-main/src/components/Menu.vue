<template>
    <div class="menu">
        <div class="menu__item" :class="{ item__selected: isSelected(0) }">
            <img id="flow-button" src="../assets/edit.png" @click="sendMenu(0)">
        </div>
        <div class="menu__item" :class="{ item__selected: isSelected(1) }">
            <img id="hist-button" src="../assets/calendar.png" @click="sendMenu(1)">
        </div>
        <div class="menu__item" :class="{ item__selected: isSelected(2) }">
            <img id="dict-button" src="../assets/dict.png" @click="sendMenu(2)">
        </div>
        <div class="menu__item" :class="{ item__selected: isSelected(3) }">
            <img id="person-button" src="../assets/person.png" @click="sendMenu(3)">
        </div>
        <div class="menu__item" :class="{ item__selected: isSelected(4) }">
            <img id="wold-button" src="../assets/world.png" @click="sendMenu(4)">
        </div>
        <div class="menu__item" :class="{ item__selected: isSelected(5) }">
            <img id="memo-button" src="../assets/memo.png" @click="sendMenu(5)">
        </div>
        <div class="menu__item--config">
            <img id="config-button" src="../assets/config.png" @click="sendMenu(6)">
        </div>
    </div>    
</template>

<script lang="ts">
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";
import { IReceiveString } from "./models/utils";

@Options({
    props: {
        changeMenu: {
            type: Function as PropType<IReceiveString>,
            required: true
        },
        index: {
            type: Number,
            default: 0,
            required: true
        }
    },
    methods: {
        sendMenu: function(index: number) {
            this.changeMenu(index);
        },
        isSelected: function(idx: number) {
            return idx == this.index;
        }
    }
})

export default class Menu extends Vue {
    changeMenu!: IReceiveString;
    index!: number;
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

.menu {
    position: fixed;
    top: $Header-Height;
    bottom: $Footer-Height;
    left: -1px;
    width: $Menu-Width;
    padding: 6px 2px;
    border-right: solid 1px $Hierarchy-Color-Line;
    height: 100%;
    display: flex;
    flex-direction: column;

    & img {
        width: 85%;
        cursor: pointer;
        filter: brightness($Normal-Brightness);
    }

    & img:hover {
        filter: brightness($Focus-Brightness);
    }

    & .item__selected {
        border-left: solid 2px $Selected-Border-Color;
    }

    &__item {
        margin-bottom: 7px;
        padding: 4px;

        &--config {
            margin-top: auto;
            margin-bottom: 8px;
        }
    }
}
</style>