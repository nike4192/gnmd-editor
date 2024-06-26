import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import CourseArticleView from "@app/views/CourseArticleView.vue";
import CoursesView from "@app/views/CoursesView.vue";
import LoginView from "@app/views/LoginView.vue";
import HomeView from "@app/views/HomeView.vue";
import { useAuthStore } from "@app/stores/auth";
import { useToast } from "primevue/usetoast";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/courses",
    name: "courses",
    component: CoursesView,
  },
  {
    path: "/courses/:courseUrlTitle/:articleUrlTitles*",
    name: "course-article",
    component: CourseArticleView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const toast = useToast();
  const authStore = useAuthStore();
  if (!authStore.profile) {
    await authStore.fetchProfile();

    if (!authStore.profile) {
      toast.add({ severity: 'secondary', summary: 'Auth required', life: 3000 });
    }
  }
})

export default router;
