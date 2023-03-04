<template>
  <div>
    <va-modal
      v-model="isActive"
      no-outside-dismiss
      class="ma-0"
      blur
      :overlay="false"
    >
      <template #content>
        <va-card class=" ma-0 card-main-layout-success">
          <va-card-title class="pb-1">{{ title }}</va-card-title>

          <va-card-content class="">
            <va-form ref="form" class="ma-4 ">
              <div class="form__wrapper">
                <va-input
                  class="mb-3"
                  v-for="prop in Object.keys(itemModel.label)"
                  :key="prop"
                  v-model="dataForm[prop]"
                  :label="itemModel.label[prop]"
                  :loading="isLoad"
                  :readonly="isLoad"
                  :rules="
                    rules.hasOwnProperty(prop) ? rules[prop] : rules['field']
                  "
                ></va-input>
              </div>
            </va-form>
          </va-card-content>
          <va-card-actions class=" pt-1 mt-1">
            <va-button
              preset="secondary"
              border-color="success"
              class="mr-6 mb-2"
              text-color="success"
              round
              :loading="isLoad"
              @click="onClickApply"
            >
              {{ labelActionBtn.apply }}
            </va-button>
            <va-spacer></va-spacer>
            <va-button
              :disabled="isLoad"
              preset="secondary"
              border-color="danger"
              class="mr-6 mb-2"
              text-color="danger"
              round
              @click="onClickCancelForm"
            >
              {{ labelActionBtn.cancel }}
            </va-button>
          </va-card-actions>
        </va-card>
      </template>
    </va-modal>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {logR} from '@/service/utils';
export default defineComponent({
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return '';
      }
    },
    itemModel: {type: Object, required: true},
    isActive: {type: Boolean, required: true},
    isSucces: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    labelActionBtn: {
      type: Object,
      required: false,
      default() {
        return {apply: 'Принять', cancel: 'Закрыть'};
      }
    },
    onClickApplyForm: {type: Function, required: true},
    onClickCancelForm: {type: Function, required: true}
  },
  data() {
    return {
      dataForm: this.itemModel,
      isFormValid: false,
      isLoad: false,
      rules: {
        field: [
          (value: string) =>
            value.trim().length > 0 || 'Поле необходимо заполнить'
        ],
        password: [
          (value: string) =>
            value.length > 5 || 'Пароль должен иметь не менее 5 символов',
          (value: string) =>
            /[1-9]/.test(value) || 'Пароль должен содержать цифры.'
        ]
      }
    };
  },
  methods: {
    onClickApply() {
      logR('warn', 'FORM: onCLickApplyForm');
      console.log(this.dataForm);
      this.isLoad = true;
      if (this.$refs.form.validate()) {
        // this.onClickApplyForm(this.dataForm);
        this.isLoad = false;
      }
    }
  }
});
</script>
