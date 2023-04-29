<template>
  <n-modal v-if="render.main" v-model:show="render.main" :mask-closable="false">
    <n-spin size="large"></n-spin
  ></n-modal>
  <div v-else class="page-content">
    <n-layout has-sider>
      <n-layout-sider
        :style="sidebar.active ? 'min-width: 25em' : 'min-width: 10em'"
      >
        <n-card>
          <template #header>
            <n-space horizontal align="center">
              <n-avatar
                class="user__avatar"
                size="large"
                round
                :style="{backgroundColor: '#ee4540'}"
              >
                <span>{{ userData.sub.slice(0, 2) }}</span>
              </n-avatar>
              <n-space vertical>
                <span class="profile_username">{{ userData.sub }}</span>
                <span class="profile_role">{{
                  userData.role.split('_')[1].toLowerCase()
                }}</span>
              </n-space>
            </n-space>
          </template>

          <div
            class="profile-sidebar-link"
            v-for="row in sidebar.rows"
            :key="row.id"
            @click="onClickToLink(row.url)"
          >
            <span class="profile-sidebar-row-border"></span>
            <span class="profile-sidebar-row-text">{{ row.title }}</span>
          </div>
        </n-card>
      </n-layout-sider>
      <n-layout>
        <n-layout-header
          class="img-header-profile"
          v-if="
            $router.currentRoute._value.name == 'profile' ||
            $router.currentRoute._value.name == 'admin'
          "
        >
          {{ $router.currentRoute._value.name }}
          <n-space justify="center" align="center">
            <n-popover trigger="hover">
              <template #trigger>
                <div class="profile-story" @click="onClickStory">
                  <n-space justify="center" align="center">
                    <n-icon size="50" color="white" class="profile-icon-story">
                      <icon-add />
                    </n-icon>
                  </n-space>
                </div>
              </template>
              <span>{{
                userData.role == 'ROLE_ADMIN' ? 'Создать историю' : 'Подробнее'
              }}</span>
            </n-popover>
          </n-space>
        </n-layout-header>
        <n-layout-content></n-layout-content>
      </n-layout>
    </n-layout>

    <c-form
      v-if="forms.createStory.active"
      :isActive="forms.createStory.active"
      title="Создание истории"
      :itemModel="forms.createStory.model"
      labelApplyButton="Создать"
      :applyFunction="onClickApplyCreateStory"
      :cancelFunction="onClickCancelCreateStory"
    >
    </c-form>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import {NAvatar} from 'naive-ui';
import {logR} from '@/services/utils';
import CreateStory from '@/models/model.create.story';

export default defineComponent({
  components: {'n-avatar': NAvatar},
  data() {
    return {
      sidebar: {active: false, rows: []},
      render: {main: false},
      forms: {createStory: {active: false, model: CreateStory}},
      arrays: {
        stories: [
          {
            id: 0,
            title: 'Murder_Mystery',
            difficulty: 'Some difficultys',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            story_text: 'Some text',
            answer: 'answer1',
          },
        ],
      },
    };
  },

  computed: {
    ...mapGetters({
      getUserToken: 'auth/GET_TOKEN_USER',
      userData: 'auth/GET_DATA_LOGIN',
    }),
  },
  async created() {
    // TODO: Подгрузка историй с бека
    this.render.main = true;
    if (!this.userData) {
      this.$router.push({name: 'home'});
    } else {
      // const dataUser = this.$store.state.auth.dataLogin;

      this.sidebar.rows = this.$store.state.user.userSidebar.admin;
    }
    this.render.main = false;
  },

  methods: {
    onClickCreateStory() {
      logR('PROFILE:onCLickCreateStory');
    },
    onClickInfoStory() {
      logR('PROFILE:onClickInfoStory');
    },
    onClickStory() {
      logR('warn', 'PROFILE:onClickStory');

      if (this.userData.role == 'ROLE_ADMIN') {
        this.forms.createStory.active = true;
      } else {
        console.error('TODO:onClickStory by User');
      }
    },
    onClickToLink(url) {
      url.length > 0 ? this.$router.push(url) : '';
    },
    async onClickApplyCreateStory(dataForm) {
      logR('warn', 'PROFILE:onClickApplyCreateStory');
      console.log(dataForm);
      await this.$store.dispatch('story/createStory', dataForm);
    },

    onClickCancelCreateStory() {
      logR('warn', 'PROFILE:onCLickCancelCreateStory');
      this.forms.createStory.active = false;
    },
  },
});
</script>
