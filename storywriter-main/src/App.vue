<template>
  <div>
    <!-- Teleport targets -->
    <div id="modal-msgbox"></div>
    <div id="modal-calendaredit"></div>
    <div id="modal-colorpicker"></div>
    <div id="modal-inputbox"></div>
    <div id="modal-imgviewer"></div>

    <!-- Main contents -->
    <EditHeader :vm="vm" :settingClicked="setSettingMenu" />

    <div id="container">
      <div v-if="vm.editing">
        <Menu class="bk" :changeMenu="changeMenu" :index="vm.menuIndex" />
        <EditFlow class="bk" :style="getVisible(0)" :vm="vm" />
        <EditTimeline class="bk" :style="getVisible(1)" :select="editSelectedMenu" :vm="vm" />
        <EditDict class="bk" :style="getVisible(2)" :vm="vm" />
        <EditActor class="bk" :style="getVisible(3)" :vm="vm" />
        <EditWorld class="bk" :style="getVisible(4)" :vm="vm" />
        <EditMemo class="bk" :style="getVisible(5)" :vm="vm" />
      </div>
      <div v-else>
        <Entrance :vm="vm" />
      </div>
      <EditConfig class="bk" :style="showSettingMenu" :vm="vm" />
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
import Entrance from './components/Entrance.vue';

import { StoryWrtiterViewModel, StoryWrtiterViewModelSample } from './components/story-writer-viewmodel';
import Logger from './components/models/logger';

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
    EditConfig,
    Entrance
  },
  methods: {
    changeMenu: function(index: string) {
      this.vm.menuIndex = parseInt(index);
      this.vm.setting.showing = false;
      this.vm.history.Update(this.vm);
    },
    getVisible: function(index: number): string {
      return this.vm.menuIndex == index ? "" : "display: none;";
    },
    editSelectedMenu: function() {
      this.changeMenu(0);
    },
    setSettingMenu: function() {
      this.vm.setting.showing = true;
    }
  },
  computed: {
    showSettingMenu: function(): string {
      return this.vm.setting.showing ? "" : "display: none;";
    }
  }
})

export default class App extends Vue {
  vm: StoryWrtiterViewModel = new StoryWrtiterViewModel("");

  created() {
    Logger.write("Storywriter start.", "enjoy.", Logger.LoggingStatus.Info);
  }

  // Undo & Redo
  mounted() {
    document.addEventListener("keydown", this.Undo);
    document.addEventListener("keydown", this.Redo);
  }
  beforeDestroy() {
    document.removeEventListener("keydown", this.Undo);
    document.removeEventListener("keydown", this.Redo);
  }
  public Undo(e: KeyboardEvent): void {
    if(!this.vm.editing || this.vm.modalShowing) return;
    if((e.ctrlKey || e.metaKey) && e.key == 'z') {
      console.log(`Undo: ${this.vm.history.currentPosition}`);
      this.vm.history.Undo(this.vm);
    }
  }
  public Redo(e: KeyboardEvent): void {
    if(!this.vm.editing || this.vm.modalShowing) return;
    if((e.ctrlKey || e.metaKey) && e.key == 'y') {
      console.log(`Redo: ${this.vm.history.currentPosition}`);
      this.vm.history.Redo(this.vm);
    }
  }
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
