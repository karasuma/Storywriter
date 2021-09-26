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
      <Menu class="background" />
      <EditFlow class="background" :root="vms.hierarchy"/>
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
    EditFlow
  }
})

export default class App extends Vue {
  vm!: StoryWrtiterViewModel;
  vms: StoryWrtiterViewModelSample = new StoryWrtiterViewModelSample();
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
