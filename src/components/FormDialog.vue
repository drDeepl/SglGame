<template>
  <n-modal
    v-if="modalActive"
    v-model:show="modalActive"
    :mask-closable="false"
    :title="title"
  >
    <n-card
      class="border-top-green card-main-layer"
      type="dialog"
      :title="title"
    >
      <template #header-extra>
        <n-button
          quaternary
          circle
          type="error"
          :focusable="false"
          @click="onClickCancelButton"
        >
          <icon-close style="width: 1.7em" />
        </n-button>
      </template>
      <n-form ref="formRef" :model="formValue" :rules="toValidate ? rules : {}">
        <div
          class="form-field"
          v-for="field in Object.keys(itemModel.data)"
          :key="field"
        >
          <n-form-item
            v-if="!hideProps[field]"
            :loading="status.running"
            :label="itemModel.labels[field]"
            :path="field"
          >
            <n-input
              v-if="field == 'password'"
              type="password"
              show-password-on="click"
              v-model:value="formValue[field]"
              placeholder=""
            />
            <n-input v-else v-model:value="formValue[field]" placeholder="" />
          </n-form-item>
        </div>
        <n-space vertical>
          <slot></slot>
        </n-space>

        <n-form-item>
          <n-button :loading="status.running" @click="onClickApplyButton">
            {{ labelApplyButton }}
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>
</template>

<script>
import {defineComponent, ref, reactive} from 'vue'; // ref
import {NForm, NFormItem, NInput} from 'naive-ui';
import {logR} from '@/services/utils';
export default defineComponent({
  components: {
    'n-input': NInput,
    'n-form-item': NFormItem,
    'n-form': NForm,
  },
  props: {
    isActive: {type: Boolean, default: false},

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
    const values = ref(props.itemModel.data);
    let formValue = reactive({values});
    const running = ref(false);
    const status = reactive({running});
    const onClickSubmit = function () {
      console.log(formRef.value?.validate());
    };

    const onClickApplyButton = async function () {
      // NOTE: applyFUnction возвращает объект {ok:true}
      logR('warn', 'FormDialog: onclickApplyButton');
      status.running = true;
      const isValid = await formRef.value
        ?.validate()
        .catch((resp) => resp.length > 0);

      if (!isValid) {
        await props.applyFunction(formValue);
      }

      status.running = false;
    };

    const onClickCancelButton = function () {
      logR('warn', 'FormDialog: onclickCancelButton');
      props.cancelFunction();
    };

    return {
      modalActive,
      status,
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
