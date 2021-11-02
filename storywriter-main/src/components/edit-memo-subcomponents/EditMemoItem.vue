<template>
    <div class="memo-item">
        <ModalMessageBox
            :isVisible="showMsgbox"
            :param="messages"
            :result="getResult"
        />
        <ModalColorPicker
            :isVisible="showPickerbox"
            :getColor="getColor"
        />
        <div class="memo-item__header" :style="memoColorCss">
            <div class="memo-item__header__ctrls">
                <img @click="askDispose" src="../../assets/dispose.png">
                <img @click="pickColor" src="../../assets/paint.png">
            </div>
            <div class="memo-item__header__title">
                <input type="text" spellcheck="false"
                    placeholder="..." maxlength="128"
                    v-model="memo.name">
            </div>
        </div>
        <div class="memo-item__content">
            <textarea spellcheck="false" v-model="memo.text"></textarea>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { MemoItem } from "../models/memo/memos";
import ModalMessageBox from "../util-subcomponents/ModalMessageBox.vue";
import ModalColorPicker from "../util-subcomponents/ModalColorPicker.vue";
import { MessageObject } from "../models/utils";
import { Defs } from "../models/defs";

@Options({
    components: {
        ModalMessageBox,
        ModalColorPicker
    },
    props: {
        memo: {
            type: MemoItem,
            required: true
        }
    },
    methods: {
        askDispose: function(): void {
            const title = `<b style="padding: 0 3px; font-size: 16px;">${this.memo.name}</b>`;
            this.messages = MessageObject.createMessage(
                "警告",
                `${title} を削除しますか？`,
                true
            );
            this.showMsgbox = true;
        },
        getResult: function(result: number): void {
            if(result == Defs.MessageType.Confirm) {
                this.memo.deleteMe();
            }
            this.showMsgbox = false;
        },
        pickColor: function(): void {
            this.showPickerbox = true;
        },
        getColor: function(color: string): void {
            if(color.length > 0) {
                this.memo.color = color;
            }
            this.showPickerbox = false;
        }
    },
    computed: {
        memoColorCss: function(): string {
            const re = /(transparent|#[0-9a-fA-F]{6})/;
            if(re.test(this.memo.color)) {
                return `background-color: ${this.memo.color};`;
            }
            return "";
        }
    }
})

export default class EditMemoItem extends Vue {
    memo!: MemoItem;

    showMsgbox: boolean = false;
    messages: MessageObject = MessageObject.createMessage("","");

    showPickerbox: boolean = false;
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';

.memo-item {
    * { color: $Font-Color; }
    &__header {
        display: flex;
        flex-direction: row-reverse;
        margin: auto 0;

        &__ctrls {
            display: flex;
            flex-direction: row-reverse;
            margin: auto 0;

            & * {
                margin: 0 8px;
                cursor: pointer;
                user-select: none;
                font-weight: bold;
                font-size: 1.5em;
                width: 27px;
                height: 27px;
                filter: brightness($Normal-Brightness);
            }
            & *:hover {
                filter: brightness($Focus-Brightness);
            }
        }

        &__title {
            width: 100%;
            margin-right: 12px;
            padding: 4px 8px;

            & input {
                border: none;
                border-bottom: solid 1px $Separator-Color;
                border-radius: 0;
                font-size: 27px;
                width: 100%;
            }
            & input:focus {
                border-bottom: solid 1px $Font-Selected-Color;
            }
        }
    }

    &__content {
        margin: 13px;

        & textarea {
            height: 8em;
        }
    }
}
</style>