<script setup lang="ts">
import { useCourseStore } from "@app/stores/course";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import Breadcrumb from "primevue/breadcrumb";
import CourseCard from "@app/components/CourseCard.vue";

const courseStore = useCourseStore();
const { courses } = storeToRefs(courseStore);

const items = ref([
  {
    label: "Courses",
    icon: "pi pi-star",
  },
]);

onMounted(async () => {
  await courseStore.fetchCourses();
});
</script>

<template lang="pug">
.courses-container
  CourseCard(v-for="course in courses" :course="course")
</template>

<style lang="stylus">
.courses-container
  margin-top 8px
</style>
