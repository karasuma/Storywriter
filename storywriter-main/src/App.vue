<template>
  <div>
    <!-- Teleport targets -->
    <div id="modal-msgbox"></div>
    <div id="modal-calendaredit"></div>
    <div id="modal-colorpicker"></div>
    <div id="modal-inputbox"></div>
    <div id="modal-imgviewer"></div>

    <!-- Main contents -->
    <EditHeader :vm="vm" />

    <div id="container">
      <Menu class="bk" :changeMenu="changeMenu" :index="currentIndex" />
      <EditFlow class="bk" :style="getVisible(0)" :root="vm.hierarchy" />
      <EditTimeline class="bk" :style="getVisible(1)" :select="editSelectedMenu" :vm="vm" />
      <EditDict class="bk" :style="getVisible(2)" :vm="vm" />
      <EditActor class="bk" :style="getVisible(3)" :vm="vm" />
      <EditWorld class="bk" :style="getVisible(4)" :vm="vm" />
      <EditMemo class="bk" :style="getVisible(5)" :vm="vm" />
      <EditConfig class="bk" :style="getVisible(6)" :setting="vm.setting" />
    </div>

    <EditFooter :message="vm.message" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import EditHeader from './components/EditHeader.vue';
import EditFooter from './components/EditFooter.vue';
import Menu from './components/Menu.vue';
import EditFlow from './components/EditFlow.vue';
import EditTimeline from './components/EditTimeline.vue';
import EditDict from './components/EditDict.vue';
import EditActor from './components/EditActor.vue';
import EditWorld from './components/EditWorld.vue';
import EditMemo from './components/EditMemo.vue';
import EditConfig from './components/EditConfig.vue';

import { StoryWrtiterViewModel, StoryWrtiterViewModelSample } from './components/story-writer-viewmodel';

// Options
@Options({
  components: {
    EditHeader,
    EditFooter,
    Menu,
    EditFlow,
    EditTimeline,
    EditDict,
    EditActor,
    EditWorld,
    EditMemo,
    EditConfig
  },
  methods: {
    changeMenu: function(index: string) {
      this.currentIndex = parseInt(index);
    },
    getVisible: function(index: number): string {
      return this.currentIndex == index ? "" : "display: none;";
    },
    editSelectedMenu: function() {
      this.changeMenu(0);
    }
  }
})

export default class App extends Vue {
  vm: StoryWrtiterViewModel = new StoryWrtiterViewModelSample();

  currentIndex: number = 0;
}
</script>

<style lang="scss">
@import './components/templates/darktheme.scss';
@import './components/templates/common.scss';

#container {
  z-index: $Normal-ZIndex;
  & .bk {
    background-color: $Background-Color;
  }
}
</style>
