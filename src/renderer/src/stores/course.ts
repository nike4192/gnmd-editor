import { defineStore } from "pinia";
import { useAxios } from "@app/composables/axios";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

export const useCourseStore = defineStore("course", () => {
  const route = useRoute();
  const { axiosInstance } = useAxios();
  const courses = ref<any[]>([]);

  const currentCourse = computed(() => {
    const coursesArray = courses.value;
    if (coursesArray && coursesArray.length) {
      return coursesArray.find(
        (course) => course.urlTitle == route.params.courseUrlTitle
      );
    }
    return null;
  });

  async function fetchCourses() {
    const response = await axiosInstance.get("/courses");
    courses.value = response.data;
  }

  return {
    courses,
    fetchCourses,
    currentCourse,
  };
});
