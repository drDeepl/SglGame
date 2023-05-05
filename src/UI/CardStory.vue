<template>
  <div>
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
        <n-icon size="50" color="white" class="profile-icon-story">
          <icon-play />
        </n-icon>
      </n-space>
    </n-card>
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
