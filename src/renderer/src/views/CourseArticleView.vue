<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import Tree from 'primevue/tree';
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import { useCourseStore } from "@app/stores/course";
import Breadcrumb from "primevue/breadcrumb";
import { useArticleStore } from "@app/stores/article";
import ArticleEditor from "@app/components/ArticleEditor.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const selectedKey = ref(null);
const courseStore = useCourseStore();
const articleStore = useArticleStore();

const { courses, currentCourse } = storeToRefs(courseStore);
const { pathToNestedArticle } = articleStore;
const { courseArticles, courseNestedArticleArray, currentCourseArticle, articlesToSelect, breadCrumbItems } =
  storeToRefs(articleStore);

function selectArticle(article) {
  router.push(pathToNestedArticle(article, currentCourse.value));
}

onMounted(async () => {
  await courseStore.fetchCourses();
  await articleStore.fetchArticles();
});
</script>

<template lang="pug">
template(v-if="currentCourse")
Breadcrumb(:model="breadCrumbItems")
  template(#item="{ item, props }")
    router-link(
      v-slot="{ href, navigate }"
      :to="item.route" custom
    )
      a(
        :href="href"
        v-bind="props.action"
        @click="navigate"
      )
        span(:class="[item.icon, 'text-color']")
        span(class="text-primary font-semibold") {{ item.label }}

Splitter(
  style="height: 100%"
  state-key="main-splitter"
  state-storage="local"
)
  SplitterPanel
    Tree(
      v-model:selectionKeys="selectedKey"
      :value="courseArticles"
      selection-mode="single"
      @node-select="selectArticle"
    )
  SplitterPanel
    template(v-if="currentCourseArticle && currentCourseArticle.markdownBody")
      ArticleEditor(:article="currentCourseArticle")
</template>

<style lang="stylus">
.p-splitter
  border none
  overflow-y auto

  .p-splitter-panel
    display flex
    overflow-y auto

  .p-tree
    padding 0.5rem
    width 100%

    .p-tree-wrapper
      height 100%

      .p-tree-container
        height 100%

    .p-treenode
      user-select none

.p-breadcrumb
  margin 8px 0
  flex-shrink 0

  .breadcrumb-link:not(:first-child)::before
    content: ' > '
</style>
