<template>
  <div>
    <n-card class="story-card soft-shadow" :title="title">
      <template #header-extra><slot></slot> </template>

      <template #cover>
        <img
          v-if="imageNotFound"
          :src="require('@/assets/img/add-story.jpg')"
          class="story-card-img"
        />
        <img v-else class="img-downloaded story-card-img" />
      </template>
    </n-card>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import ServiceStoryImage from '@/services/story.image.service';

export default defineComponent({
  props: {
    title: {type: String, required: false, default: null},
    storyId: {type: Number, required: true},
    difficulty: {type: String, required: true},
    description: {type: String, required: true},
    hasImage: {type: Boolean, default: false},
  },
  data() {
    return {
      render: false,
      imageNotFound: false,
    };
  },
  async created() {
    this.render = true;
    console.log(this.title);
    const response = await ServiceStoryImage.findStoryImageById(this.storyId);
    if (response.status != 200) {
      this.imageNotFound = true;
    } else {
      console.log(this.storyId);
      this.render = false;
      document.querySelector(
        '.img-downloaded'
      ).src = `data:${response.type};base64,${response.data}`;
    }
  },
});
</script>
