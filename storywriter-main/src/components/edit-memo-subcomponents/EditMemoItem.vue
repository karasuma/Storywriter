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
                <img :class="{invisible: !arrowVisibleCss(memo, true)}"
                    @click="moveMemo(`${memo.id}---o`)"
                    style="transform: rotate(-90deg);" src="../../assets/arrow.png">
                <img :class="{invisible: !arrowVisibleCss(memo, false)}"
                    @click="moveMemo(`${memo.id}---x`)"
                    style="transform: rotate(90deg);" src="../../assets/arrow.png">
            </div>
            <div class="memo-item__header__title">
                <input id="memoName" type="text" spellcheck="false"
                    placeholder="..." maxlength="128"
                    v-model="memo.name">
            </div>
        </div>
        <div class="memo-item__content">
            <textarea id="memoDescription" spellcheck="false" v-model="memo.text"></textarea>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { MemoItem } from "../models/memo/memos";
import ModalMessageBox from "../util-subcomponents/ModalMessageBox.vue";
import ModalColorPicker from "../util-subcomponents/ModalColorPicker.vue";
import { IReceiveString, MessageObject } from "../models/utils";
import { Defs } from "../models/defs";
import { PropType } from "@vue/runtime-core";
import { StoryWrtiterViewModel } from "../story-writer-viewmodel";

@Options({
    components: {
        ModalMessageBox,
        ModalColorPicker
    },
    props: {
        vm: {
            type: StoryWrtiterViewModel,
            required: true
        },
        memo: {
            type: MemoItem,
            required: true
        },
        moveMemo: {
            type: Function as PropType<IReceiveString>,
            required: true
        },
        filteringColor: {
            type: String,
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
                this.vm.history.Update(this.vm);
            }
            this.showMsgbox = false;
        },
        pickColor: function(): void {
            this.showPickerbox = true;
        },
        getColor: function(color: string): void {
            if(color.length > 0) {
                this.memo.color = color;
                this.vm.history.Update(this.vm);
            }
            this.showPickerbox = false;
        },
        arrowVisibleCss: function(item: MemoItem, isUp: boolean): boolean {
            const currentMemos = item.parent.memoList.filter((x: MemoItem) => {
                return !(this.vm.memos.filterColor != "transparent" && this.vm.memos.filterColor != x.color);
            });
            const idx = currentMemos.findIndex(x => x.id == item.id);

            return (!isUp && idx > 0) || (isUp && idx < currentMemos.length - 1);
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
    vm!: StoryWrtiterViewModel;
    memo!: MemoItem;
    moveMemo!: IReceiveString;

    showMsgbox = false;
    messages: MessageObject = MessageObject.createMessage("","");

    showPickerbox = false;
    
    registerTextareas() {
        const onFocus = () => {
            this.vm.textEdting = true;
        };
        const onBlur = () => {
            this.vm.textEdting = false;
            this.vm.history.Update(this.vm);
        };
        const registerAttribute = ["registered", "attached"];
        const inputElem = document.getElementById("memoName");
        if(inputElem !== null && inputElem.getAttribute(registerAttribute[0]) !== registerAttribute[1]) {
            inputElem.onfocus = onFocus;
            inputElem.onblur = onBlur;
            inputElem.setAttribute(registerAttribute[0], registerAttribute[1]);
        }
        const textareaElem = document.getElementById("memoDescription");
        if(textareaElem !== null && textareaElem.getAttribute(registerAttribute[0]) !== registerAttribute[1]) {
            textareaElem.onfocus = onFocus;
            textareaElem.onblur = onBlur;
            textareaElem.setAttribute(registerAttribute[0], registerAttribute[1]);
        }
    }
    mounted() {
        this.registerTextareas();
    }
    updated() {
        this.registerTextareas();
    }
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

.invisible {
    display: none;
}
</style>