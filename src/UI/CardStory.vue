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
          <img class="img-downloaded story-card-img" />
        </div>
      </template>
    </n-card>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import ServiceStoryImage from '@/services/story.image.service';
// import ServiceDownloadFile from '@/services/download.service';
export default defineComponent({
  props: {
    title: {type: String, required: true},
    storyId: {type: Number, required: true},
    difficulty: {type: String, required: true},
    description: {type: String, required: true},
  },
  data() {
    return {
      render: false,
      imageNotFound: false,
      imageSrc: '',
    };
  },
  async created() {
    this.render = true;
    const response = await ServiceStoryImage.findStoryImageById(this.storyId);
    if (response.status != 200) {
      this.imageNotFound = true;
    } else {
      //   const url =
      //     'http://localhost:8080/api/userDB/stories_images/findByStoryId/' +
      //     this.storyId;
      //   const file = await ServiceDownloadFile.downloadFileInUint8Array(url);
      //   const b64 = Buffer.from(file).toString('base64');
      //   document.querySelector('.img-story-card').src =
      //     'data:image/jpeg;base64,' + b64;
      // }
      const b64 = Buffer.from(response.data).toString('base64');
      document.querySelector('.img-downloaded').src =
        'data:image/jpeg;base64,' + b64;
    }
    console.log('RESPONSE IMAGE\n', response);
    console.log(this.storyId);
    this.render = false;
  },
});
</script>
