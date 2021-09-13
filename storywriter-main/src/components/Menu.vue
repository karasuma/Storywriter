<template>
    <div class="menu">
        <div class="menu__item item-selected">
            <img id="flow-button" src="../assets/edit.png">
        </div>
        <div class="menu__item">
            <img id="hist-button" src="../assets/calendar.png">
        </div>
        <div class="menu__item">
            <img id="dict-button" src="../assets/dict.png">
        </div>
        <div class="menu__item">
            <img id="person-button" src="../assets/person.png">
        </div>
        <div class="menu__item">
            <img id="wold-button" src="../assets/world.png">
        </div>
        <div class="menu__item">
            <img id="memo-button" src="../assets/memo.png">
        </div>
        <div class="menu__item--config">
            <img id="config-button" src="../assets/config.png">
        </div>
    </div>    
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({

})

export default class Menu extends Vue {
    
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

    & .item-selected {
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