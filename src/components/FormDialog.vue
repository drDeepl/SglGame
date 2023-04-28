<template>
  <n-modal
    v-if="modalActive"
    v-model:show="modalActive"
    :mask-closable="false"
    :title="title"
  >
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
        <n-space vertical>
          <slot></slot>
        </n-space>

        <n-form-item>
          <n-button @click="onClickApplyButton">
            {{ labelApplyButton }}
          </n-button>
          <n-button @click="onClickCancelButton">
            {{ labelCancelButton }}
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {NModal, NForm, NFormItem, NInput, NCard} from 'naive-ui';
import {logR} from '@/services/utils';
export default defineComponent({
  components: {
    'n-modal': NModal,
    'n-input': NInput,
    'n-form-item': NFormItem,
    'n-form': NForm,
    'n-card': NCard,
  },
  props: {
    isActive: {type: Boolean, default: false},
    isSuccess: {type: Boolean, default: false},
    title: {
      type: String,
      required: false,
      default() {
        return '';
      },
    },
    itemModel: {type: Object, required: true},
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
    labelApplyButton: {type: String, default: 'Принять', required: false},
    labelCancelButton: {type: String, default: 'Отмена', required: false},
    applyFunction: {type: Function, required: false},
    cancelFunction: {type: Function, required: false},
  },
  setup(props) {
    const modalActive = ref(props.isActive);
    const formRef = ref(null);
    const formValue = ref(props.itemModel.data);
    const onClickSubmit = function () {
      console.log(formRef.value?.validate());
    };

    const onClickApplyButton = async function () {
      // NOTE: applyFUnction возвращает объект {ok:true}
      logR('warn', 'FormDialog: onclickApplyButton');
      await props.applyFunction(props.itemModel.data);
    };

    const onClickCancelButton = function () {
      logR('warn', 'FormDialog: onclickCancelButton');
    };

    return {
      modalActive,
      formRef,
      formValue,
      onClickSubmit,
      rules: props.itemModel.rules,
      onClickApplyButton,
      onClickCancelButton,
    };
  },
});
</script>
