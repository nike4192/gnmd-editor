<script setup lang="ts">
import { useCourseStore } from "@app/stores/course";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useArticleStore } from "@app/stores/article";

const courseStore = useCourseStore();
const articleStore = useArticleStore();

const { courses, currentCourse } = storeToRefs(courseStore);
const { courseArticles } = storeToRefs(articleStore);

onMounted(async () => {
  await courseStore.fetchCourses();
  await articleStore.fetchArticles();
});
</script>

<template lang="pug">
template(v-if="currentCourse")
  h2 {{ currentCourse.title }}
  ol.article-list
    li.article-item(v-for="courseArticle in courseArticles")
      router-link(:to="`/courses/${currentCourse.urlTitle}/${courseArticle.urlTitle}`") {{ courseArticle.title }}
</template>

<style scoped lang="stylus"></style>
