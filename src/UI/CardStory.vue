<template>
  <div>
    <!-- <n-popover :overlap="true" placemenet="top" trigger="hover"> -->
    <!-- <template #trigger> -->
    <n-card hoverable class="story-card" :title="title">
      <template #header-extra>
        <slot></slot>
      </template>
      <n-space
        justify="center"
        align="center"
        vertical
        class="story-card-content"
      >
        <!-- <span class="font-header-card"> {{ title }}</span> -->
        <n-icon size="50" color="white" class="profile-icon-story">
          <icon-play />
        </n-icon>
      </n-space>
    </n-card>
    <!-- </template> -->

    <!-- <span>{{ description }}</span> -->
    <!-- </n-popover> -->
  </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    title: {type: String, required: true},
    difficulty: {type: String, required: true},
    description: {type: String, required: true},
  },

  methods: {},
});
</script>
