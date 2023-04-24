<template>
  <n-card class="border-top-green card-main-layer" :title="title">
    <n-form ref="formRef" :model="formValue" :rules="toValidate ? rules : {}">
      <div
        class="form-field"
        v-for="field in Object.keys(itemModel.data)"
        :key="field"
      >
        <n-form-item
          v-if="!hideProps[field]"
          :label="itemModel.labels[field]"
          :path="field"
        >
          <n-input v-model:value="formValue[field]" placeholder="" />
        </n-form-item>
      </div>
      <n-form-item>
        <n-button @click="onClickSubmit"> Принять </n-button>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { NForm, NFormItem, NInput, NButton, NCard } from "naive-ui";

export default defineComponent({
  components: {
    "n-input": NInput,
    "n-form-item": NFormItem,
    "n-form": NForm,
    "n-button": NButton,
    "n-card": NCard,
  },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    itemModel: { type: Object, required: true },
    toValidate: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    hideProps: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const formRef = ref(null);
    const formValue = ref(props.itemModel.data);
    const onClickSubmit = function () {
      console.log(formRef.value?.validate());
    };

    return {
      formRef,
      formValue,
      onClickSubmit,
      rules: props.itemModel.rules,
    };
  },
});
</script>
