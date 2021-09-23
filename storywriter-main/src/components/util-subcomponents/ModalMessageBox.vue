<template>
    <teleport to="#modal-msgbox" v-if="isVisible">
        <div class="modal">
            <div class="modal__content">
                <div class="modal__content__header">
                    <p class="modal__content__header-caption">{{ param.caption }}</p>
                    <p class="modal__content__header-close" @click="disable">&times;</p>
                </div>
                <div class="modal__content__desc">
                    <img v-if="param.alert" src="../../assets/alert.png">
                    <img v-else src="../../assets/info.png">
                    <p v-html="param.message"></p>
                </div>
                <div class="modal__content__buttons">
                    <span class="modal__content__buttons-close" @click="reject">no, thanks.</span>
                    <span class="modal__content__buttons-ok" @click="confirm">Go ahead!</span>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Options, Vue } from "vue-class-component";
import { Defs } from "../models/defs";
import IMessageResult from "../models/msgbox-result-interface";
import { MessageObject } from "../models/utils";

@Options({
    props: {
        isVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        param: MessageObject,
        result: Function as PropType<IMessageResult>
    },
    methods: {
        disable: function() {
            this.result(Defs.MessageType.None);
        },
        confirm: function() {
            this.result(Defs.MessageType.Confirm);
        },
        reject: function() {
            this.result(Defs.MessageType.Reject);
        }
    }
})

export default class ModalMessageBox extends Vue {
    isVisible!: boolean;
    param!: MessageObject;
    result!: IMessageResult;
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
        margin: 30vh 30vw;
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
        &__desc {
            width: 100%;
            min-height: 15vh;
            padding: 20px;
            display: flex;
            align-items: center;
            & img {
                width: 58px;
                padding: 10px;
            }
            & p {
                padding: 4px;
            }
        }
        &__buttons {
            width: 100%;
            height: 32px;

            display: flex;
            flex-direction: row-reverse;

            & * {
                font-size: 14px;
                border-radius: 2px;
                margin: 4px 8px;
                width: 100px;
                padding: 2px;
                text-align: center;
                background-color: $Modal-Button;
            }

            &-close {
                border: solid 1px #000060;
            }
            &-close:hover {
                background-color: #afcccc;
            }
            &-ok {
                border: solid 1px #600000;
            }
            &-ok:hover {
                background-color: #ccafaf;
            }
        }
    }
}
</style>