<template>
    <div class="actor__item" :class="{ actor__item__selected: selected }" :title="nameOrDefault">
        <img v-if="hasFace" :src="face">
        <img v-else src="../../assets/who.png" style="opacity: 0.6;">
        <p>{{ nameOrDefault }}</p>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        name: {
            type: String,
            required: true
        },
        face: {
            type: String,
            required: true
        },
        selected: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        nameOrDefault: function(): string {
            return this.name.length == 0 ? "...": this.name;
        },
        hasFace: function(): boolean {
            return this.face.length > 0;
        }
    }
})

export default class ActorListItem extends Vue {
    name!: string;
    face!: string;
    selected!: boolean;
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';

.actor__item {
    margin: 2px 0;
    padding: 6px 12px;
    width: 100%;
    height: 41px;
    display: flex;
    border-bottom: solid 1px $Separator-Color;

    & img {
        width: 38px;
        height: 38px;
        border-radius: 9px;
    }
    & p {
        font-size: 21px;
        margin: auto 12px;
        width: calc( 100% - 24px );
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