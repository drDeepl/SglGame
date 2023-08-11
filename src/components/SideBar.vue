<template>
  <n-layout has-sider v-if="userData">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed="collapsed"
      :collapsed-width="collapsed ? '.5em' : '6em'"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-card v-if="!collapsed">
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
            <div class="info-user-container">
              <span class="profile_username">{{
                userData ? userData.sub : ''
              }}</span>
              <span class="profile_role">{{
                userData.role.split('_')[1].toLowerCase() == 'user'
                  ? 'игрок'
                  : 'администратор'
              }}</span>
            </div>
          </n-space>
        </template>
        <span class="font-bold">Пройдено</span>
        <n-progress
          class="user-progress-container"
          type="line"
          :percentage="sidebar.userInfo.progress"
        ></n-progress>

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
    <n-layout><slot></slot> </n-layout>
  </n-layout>
</template>
<script>

</script>
