<template>
  <div>
    <n-card class="story-card" :title="title">
      <template #header-extra>
        <slot></slot>
      </template>
      <template #cover>
        <img
          v-if="imageNotFound"
          :src="require('@/assets/img/add-story.jpg')"
          class="story-card-img"
        />
        <!-- <img v-else :src="imageSrc" class="story-card-img" /> -->
        <div v-else class="story-img">
          <!-- {{ imageSrc }} -->
        </div>
      </template>
    </n-card>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import ServiceStoryImage from '@/services/story.image.service';

export default defineComponent({
  props: {
    title: {type: String, required: true},
    storyId: {type: Number, required: true},
    difficulty: {type: String, required: true},
    description: {type: String, required: true},
  },
  data() {
    return {
      imageNotFound: false,
      imageSrc: '',
    };
  },
  async created() {
    const response = await ServiceStoryImage.findStoryImageById(this.storyId);
    if (response.status != 200) {
      this.imageNotFound = true;
    } else {
      let image = new Image();
      image.src = URL.createObjectURL(response.data);
      // this.imageSrc = image;
      document.querySelector('.story-img').appendChild(image);
    }
    console.log('RESPONSE IMAGE\n', response);
  },
});
</script>
