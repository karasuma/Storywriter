<template>
    <li class="item">
        <ModalMessageBox
            :isVisible="showMsgBox"
            :param="message"
            :result="getResult"
        />
        <ModalSimpleInputBox
            :isVisible="visibleInputBox"
            :result="getResultInput"
            :caption="inputCaption"
            :defaultText="defaultText"
        />
        <div class="item__header" :class="{expand: world.expanding}">
            <img src="../../assets/caret.png">
            <p @click="toggleExpandGroup()" :title="world.name">{{ world.name }}</p>
            <img class="item__header__img" src="../../assets/edit.png" @click="showInputBox">
            <img class="item__header__img" src="../../assets/dispose.png" @click="showMessageBox">
        </div>
        <ul class="item__worlds">
            <li v-for="c in world.countries" :key="c"
                @click="selectCountry(c.id)"
                :class="{selected: c.editing}" :title="c.name">{{ c.name }}</li>
            <li><img src="../../assets/add.png" @click="addCountry()"></li>
        </ul>
    </li>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { World } from "../models/world/worlds";
import { Country } from "../models/world/country";

import ModalMessageBox from "../util-subcomponents/ModalMessageBox.vue";
import ModalSimpleInputBox from "../util-subcomponents/ModalSimpleInputBox.vue";
import { Enumerable, ISimpleFunction, MessageObject } from "../models/utils";
import { Defs } from "../models/defs";
import { PropType } from "@vue/runtime-core";
import { StoryWriterViewModel } from "../story-writer-viewmodel";

@Options({
    components: {
        ModalMessageBox,
        ModalSimpleInputBox
    },
    props: {
        vm: {
            type: StoryWriterViewModel,
            required: true
        },
        world: {
            type: World,
            required: true
        },
        resetEditFlags: {
            type: Function as PropType<ISimpleFunction>,
            required: true
        }
    },
    methods: {
        selectCountry: function(id: string): void {
            const idx = this.world.countries.findIndex((x: Country) => x.id== id);
            if(idx >= 0) {
                this.resetEditFlags();
                this.world.countries.find((x: Country) => x.id == id).editing = true;
                this.updateHistory();
            }
        },
        showInputBox: function(): void {
            this.defaultText = this.world.name;
            this.visibleInputBox = true;
        },
        getResultInput: function(text: string): void {
            if(text.length != 0) {
                this.world.name = text;
                this.updateHistory();
            }
            this.defaultText = "";
            this.visibleInputBox = false;
        },
        showMessageBox: function(): void {
            this.message = MessageObject.createMessage(
                "警告",
                "この世界を削除しますか？<br>"
                    + '<b style="padding: 0 3px; font-size: 16px;">'
                    + "' " + this.world.name + " '"
                    + "</b>",
                true
            );
            this.showMsgBox = true;
        },
        getResult: function(result: number): void {
            if(result == Defs.MessageType.Confirm) {
                this.world.deleteMe();
                this.updateHistory();
            }
            this.showMsgBox = false;
        },
        addCountry: function(): void {
            this.world.addCountry();
            this.updateHistory();
        },
        toggleExpandGroup: function(): void {
            this.world.expanding = !this.world.expanding;
            this.updateHistory();
        }
    }
})

export default class EditWorldHierarchyItem extends Vue {
    vm!: StoryWriterViewModel;
    world!: World;
    resetEditFlags!: ISimpleFunction;

    visibleInputBox = false;
    inputCaption = "土地のグループ名を変更";
    defaultText = "";

    showMsgBox = false;
    message: MessageObject = MessageObject.createMessage("","");

    public updateHistory(): void {
        this.vm.history.Update(this.vm);
    }
}
</script>

<style lang="scss" scoped>
@import '../templates/darktheme.scss';
@import '../templates/common.scss';

.item {
    margin-bottom: 10px;
    list-style-type: none;

    & * {
        cursor: pointer;
        user-select: none;
        @include hide-overflow-text();
    }
    
    &__header {
        display: flex;
        height: 1.5em;
        & img {
            min-width: 21px;
            min-height: 21px;
            &:first-child {
                min-width: 14px;
                min-height: 14px;
                margin: 2px;
            }
        }
        & p {
            font-size: 14px;
            padding: 0 8px;
            width: 100%;
        }
        &__img {
            filter: brightness($Normal-Brightness);
            &:hover {
                filter: brightness($Focus-Brightness);
            }
        }
    }

    &__worlds {
        list-style-type: none;
        display: none;
        & .selected {
            filter: brightness($Focus-Brightness);
            color: $Selected-Item-Color;
        }
        & li {
            margin: 0;
            padding: 2px 7px;
            height: 1.5em;
            border-left: solid 1px $Hierarchy-Color-Line;
            &:last-child {
                border: none;
            }
        }
        & img {
            width: 21px;
            height: 21px;
            margin-left: 4px;
            margin-bottom: 12px;
        }
        & * {
            filter: brightness($Normal-Brightness);
            &:hover {
                filter: brightness($Focus-Brightness);
            }
        }
    }

    & .expand {
        & img:first-child {
            transform: rotate(90deg);
        }
        & + ul {
            display: block;
        }
    }
}
</style>