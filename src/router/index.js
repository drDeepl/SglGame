import MainLayout from '@/Layouts/MainLayout.vue';
import UserProfile from '@/views/UserProfile.vue';
import AdminProfile from '@/views/AdminProfile.vue';
import StoryView from '@/views/StoryView.vue';
import ManageDatabase from '@/views/ManageDatabase.vue';
import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainLayout,
      children: [
        {
          path: '/user',
          name: 'user',
          component: UserProfile,
        },
        {
          path: '/admin',
          name: 'admin',
          component: AdminProfile,
          children: [],
        },
        {path: '/database', name: 'database', component: ManageDatabase},
        {path: '/stories', name: 'stories', component: StoryView},
      ],
    },
  ],
});

export default router;
