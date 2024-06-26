<script setup lang="ts">
import Card from "primevue/card";
import { useRouter } from "vue-router";
import { useArticleStore } from "@app/stores/article";
const props = defineProps(['course']);

const router = useRouter();
const { pathToNestedArticle } = useArticleStore();

</script>

<template lang="pug">
Card.course-card(style="width: 18rem; overflow: hidden")
  template(#title)
    router-link(:to="pathToNestedArticle(null, course)") {{ course.title }}
  template(#content) {{ course.description ?? '' }}
</template>

<style lang="stylus">
.course-card
  display inline-block
  margin 0 8px 8px 0
</style>