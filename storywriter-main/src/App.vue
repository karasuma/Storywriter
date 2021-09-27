<template>
  <div>
    <!-- Teleport targets -->
    <div id="modal-msgbox"></div>
    <div id="modal-calendaredit"></div>
    <div id="modal-colorpicker"></div>
    <div id="modal-inputbox"></div>

    <!-- Main contents -->
    <EditHeader />

    <div id="container">
      <Menu class="background" :changeMenu="changeMenu" />
      <EditFlow class="background" :style="getVisible(0)" :root="vms.hierarchy"/>
      <EditTimeline class="background" :style="getVisible(1)" 
        :select="editSelectedMenu" :root="vms.hierarchy"/>
    </div>

    <EditFooter />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import EditHeader from './components/EditHeader.vue';
import EditFooter from './components/EditFooter.vue';
import Menu from './components/Menu.vue';
import EditFlow from './components/EditFlow.vue';
import EditTimeline from './components/EditTimeline.vue';

// ViewModel
import { Stories } from './components/models/story/stories';
class StoryWrtiterViewModel {
  public hierarchy: Stories = new Stories(false);
}
class StoryWrtiterViewModelSample extends StoryWrtiterViewModel {
  constructor() {
    super();
    // Sample story
    const root = new Stories(true);
    const editing = root.appendNewStory(false, "サンプル");
    editing.isEditing = true;
    const dir = root.appendNewStory(true, "グループ1");
    dir.appendNewStory(false, "New awesome story 01 but this is not my product");
    dir.appendNewStory(false, "たいとる");
    root.appendNewStory(false, "邪知暴虐のゲネイオス");

    this.hierarchy = root;
  }
}

// Options
@Options({
  components: {
    EditHeader,
    EditFooter,
    Menu,
    EditFlow,
    EditTimeline
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
  vm!: StoryWrtiterViewModel;
  vms: StoryWrtiterViewModelSample = new StoryWrtiterViewModelSample();

  currentIndex: number = 0;
}
</script>

<style lang="scss">
@import './components/templates/darktheme.scss';
@import './components/templates/common.scss';

#container {
  z-index: $Normal-ZIndex;
}

.background {
  background-color: $Background-Color;
}
</style>
