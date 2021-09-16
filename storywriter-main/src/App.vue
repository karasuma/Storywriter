<template>
  <div>
    <EditHeader />

    <div id="container">
      <Menu class="background" />

      <EditFlow class="background" v-bind:stories="vms.hierarchy" />
    </div>

    <EditFooter />

    <div id="modal-msgbox"></div>
    <div id="modal-colorpicker"></div>
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
  public hierarchy: Array<Stories> = new Array<Stories>();
}
class StoryWrtiterViewModelSample extends StoryWrtiterViewModel {
  constructor() {
    super();
    // Sample story
    const sample = new Stories(false);
    sample.content.caption = "サンプル";
    sample.isEditing = true;
    const dir1 = new Stories(true);
    dir1.content.caption = "グループ１";
    const child1 = new Stories(false);
    child1.content.caption = "New awesome story 01 but this is not my product";
    const child2 = new Stories(false);
    child2.content.caption = "たいとる";

    dir1.appendStory(child1);
    dir1.appendStory(child2);
    this.hierarchy.push(sample);
    this.hierarchy.push(dir1);
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
