<template>
    <teleport to="#modal-inputbox" v-if="isVisible">
        <div class="modal">
            <div class="modal__content">
                <div class="modal__content__header">
                    <p class="modal__content__header-caption">{{ caption }}</p>
                    <p class="modal__content__header-close" @click="disable">&times;</p>
                </div>
                <div class="modal__content__input">
                    <input v-model="content" placeholder="..." @keyup.enter="confirm">
                </div>
                <div class="modal__content__buttons">
                    <span v-if="confirmable" class="modal__content__buttons-ok" @click="confirm">Confirm</span>
                    <span v-else class="modal__content__buttons-disable">Confirm</span>
                </div>
            </div>
        </div>
    </teleport>    
</template>

<script lang="ts">
import { PropType } from "vue";
import { Options, Vue } from "vue-class-component";
import { IReceiveString } from "../models/utils";


@Options({
    props: {
        isVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        caption: {
            type: String,
            default: ""
        },
        defaultText: {
            type: String,
            default: ""
        },
        result: Function as PropType<IReceiveString>
    },
    methods: {
        disable() {
            this.result("");
            this.content = "";
        },
        confirm() {
            if(this.confirmable) {
                this.result(this.content);
                this.content = "";
            }
        }
    },
    computed: {
        confirmable: function(): Boolean {
            return this.content.length > 0;
        }
    },
    watch: {
        defaultText: function(curr: string, _) {
            if(curr.length > 0) this.content = curr;
        }
    }
})

export default class ModalSimpleInputBox extends Vue {
    isVisible!: boolean;
    caption!: string;
    defaultText!: string;
    result!: IReceiveString;

    content: string = "";
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
        &__input {
            width: 100%;
            min-height: 15vh;
            display: flex;
            justify-content: center;
            align-items: center;

            & input {
                border: none;
                border-bottom: solid 1px $Separator-Color;
                border-radius: 0;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                margin: 8px 12px;
                width: 90%;
                height: 1.5em;
            }
            & input:focus {
                border-bottom: solid 1px $Font-Selected-Color;
            }
        }
        &__buttons {
            width: 100%;
            height: 32px;

            display: flex;
            flex-direction: row-reverse;

            &-ok {
                font-size: 14px;
                border-radius: 2px;
                margin: 4px 8px;
                width: 100px;
                padding: 2px;
                text-align: center;
                background-color: $Modal-Button;
                border: solid 1px #600000;
                &:hover {
                    background-color: #ccafaf;
                }
            }
            &-disable {
                font-size: 14px;
                border-radius: 2px;
                margin: 4px 8px;
                width: 100px;
                padding: 2px;
                text-align: center;
                background-color: $Modal-Button-Focus;
                border: solid 1px #600000;
                cursor: not-allowed;
            }
        }
    }
}
</style>