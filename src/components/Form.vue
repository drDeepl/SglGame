<template>
  <div>
    <va-modal size="small" v-model="active" no-outside-dismiss class="ma-0">
      <template #content>
        <va-card class="card-main-layer ma-0">
          <va-card-title>Заголовок карты</va-card-title>
          <v-card-content>
            <va-form ref="form" class="flex flex-col">
              <va-input
                class="row align-space-around"
                v-for="prop in Object.keys(itemModel.label)"
                :key="prop"
                v-model="dataForm[prop]"
                :label="itemModel.label[prop]"
              ></va-input>
            </va-form>
          </v-card-content>
          <va-card-actions>
            <va-button
              preset="secondary"
              border-color="success"
              class="mr-6 mb-2"
              text-color="success"
              round
            >
              Принять
            </va-button>
            <va-button
              preset="secondary"
              border-color="danger"
              class="mr-6 mb-2"
              text-color="danger"
              round
            >
              Закрыть
            </va-button>
          </va-card-actions>
        </va-card>
      </template>
    </va-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logR } from "@/service/utils";
export default defineComponent({
  props: {
    itemModel: { type: Object, required: true },
    isActive: { type: Boolean, required: true },
  },
  data() {
    return {
      dataForm: this.itemModel,
      active: true,
    };
  },
  methods: {
    onClickApplyForm() {
      logR("warn", "FORM: onCLickApplyForm");
    },
  },
});
</script>
