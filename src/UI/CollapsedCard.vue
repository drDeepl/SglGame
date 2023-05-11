<template>
  <n-card :title="title" class="story-description-block-container">
    <template #header-extra>
      <n-icon
        size="15"
        :class="`cursor-layout ${isActive ? 'rotate-0-deg' : 'rotate-180-deg'}`"
        @click="isActive = !isActive"
        ><icon-triangle-up color="black"
      /></n-icon>
    </template>
    <n-collapse-transition :show="isActive">
      <slot></slot>
    </n-collapse-transition>
  </n-card>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    title: {type: String, required: true},
  },

  data() {
    return {
      isActive: false,
    };
  },
});
</script>
