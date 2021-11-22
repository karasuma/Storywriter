<template>
    <teleport to="#modal-colorpicker" v-if="isVisible">
        <div class="modal">
            <div class="modal__content">
                <div class="modal__content__header">
                    <p class="modal__content__header-caption">色の選択</p>
                    <p class="modal__content__header-close" @click="disable">&times;</p>
                </div>
                <div class="modal__content__colors">
                    <div class="modal__content__colors-item"
                        v-for="color in getColors" :key="color"
                        @click="setColor(color)"
                        :style="{ backgroundColor: color }"
                    >
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PropType } from "vue";
import { IReceiveString } from "../models/utils";
import { Defs } from "../models/defs";

@Options({
    props: {
        isVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        darkmode: {
            type: Boolean,
            default: true
        },
        getColor: Function as PropType<IReceiveString>
    },
    computed: {
        getColors: function(): Array<string> {
            const colors = this.darkmode
                ? Defs.definedDarkColors
                : Defs.definedLightColors;
            return colors;
        }
    },
    methods: {
        disable: function() {
            this.getColor("");
        },
        setColor: function(color: string) {
            this.getColor(color);
        }
    }
})

export default class ModalColorPicker extends Vue {
    isVisible!: boolean;
    darkmode!: boolean;
    getColor!: IReceiveString;
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';
@import '../templates/modal.scss';

.modal {
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    z-index: $Modal-ZIndex;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);

    & * {
        color: $Modal-Font-Color;
        user-select: none;
        cursor: default;
    }

    &__content {
        background-color: $Modal-Background;
        margin: 30vh 32vw;
        border: solid 1px $Hierarchy-Color-Line;
        border-radius: 6px;
        box-shadow: 0 0 10px gray;

        &__header {
            width: 100%;
            height: 32px;
            display: flex;
            justify-content: right;

            &-caption {
                width: 100%;
                font-size: 14px;
                margin: 3px 14px;
                padding-top: 2px;
                text-align: center;
                @include hide-overflow-text();
            }
            
            &-close {
                width: 52px;
                text-align: center;
                font-size: 41px;
                line-height: 22px;
                border-top-right-radius: 6px;
            }
            &-close:hover {
                background-color: $Modal-Button-Focus;
            }
        }

        &__colors {
            margin: 0 auto;
            padding: 6px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-content: flex-start;

            &-item {
                margin: 12px;
                width: 52px;
                height: 48px;
                border: solid 2px #888888;
                border-radius: 6px;
            }
            &-item:hover {
                opacity: 0.6;
            }
        }
    }
}

</style>