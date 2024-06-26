import { defineStore, storeToRefs } from "pinia";
import { useAxios } from "@app/composables/axios";
import { computed, ref } from "vue";
import { useCourseStore } from "@app/stores/course";
import { useRoute } from "vue-router";

export const useArticleStore = defineStore("article", () => {
  const { axiosInstance } = useAxios();
  const { currentCourse } = storeToRefs(useCourseStore());

  const route = useRoute();
  const courseArticles = ref<any[]>([]);

  const articlesToSelect = computed(() => {
    const { articleUrlTitles } = route.params;
    if (articleUrlTitles && articleUrlTitles.length) {
      return currentCourseArticle.value?.children ?? [];
    } else {
      return courseArticles.value;
    }
  });

  const courseNestedArticleArray = computed(() => {
    const { articleUrlTitles } = route.params;

    if (
      currentCourse.value &&
      Array.isArray(articleUrlTitles) &&
      articleUrlTitles.length
    ) {
      const nestedArticleArray = [];
      let articles = courseArticles.value;
      let article = null;

      for (const articleUrlTitle of articleUrlTitles) {
        article = articles.find((a) => a.urlTitle === articleUrlTitle);
        if (article) {
          nestedArticleArray.push(article);
          if (article.children && article.children.length) {
            articles = article.children;
          } else {
            return nestedArticleArray;
          }
        } else {
          break;
        }
      }

      return nestedArticleArray;
    }
    return [];
  });

  const breadCrumbItems = computed(() => {
    const course = currentCourse.value;
    if (course) {
      const items = [{
        route: `/courses/${course.urlTitle}`,
        label: course.title,
      }];

      if (courseNestedArticleArray.value) {
        for (const article of courseNestedArticleArray.value) {
          items.push({
            route: pathToNestedArticle(article, course),
            label: article.title,
          })
        }
      }

      return items;
    }
  });

  function pathToNestedArticle(
    article: any,
    course: any = null,
    accumPath = ""
  ): string {
    if (article) {
      accumPath = `/${article.urlTitle}${accumPath}`;
    }
    if (article && article.parent) {
      return pathToNestedArticle(article.parent, course, accumPath);
    } else {
      return (course ? `/courses/${course.urlTitle}` : "") + accumPath;
    }
  }

  const currentCourseArticle = computed(() => {
    const nestedArticleArray = courseNestedArticleArray.value;
    if (nestedArticleArray.length) {
      return nestedArticleArray[nestedArticleArray.length - 1];
    } else {
      return null;
    }
  });

  function traverseArticleParents(article: any) {
    article.key = article.uuid;
    article.label = article.title;
    if (article.children && article.children.length) {
      for (const child of article.children) {
        child.parent = article;
        traverseArticleParents(child);
      }
    }
  }

  async function fetchArticles() {
    if (currentCourse.value) {
      const response = await axiosInstance.get("/articles", {
        params: {
          sectionId: currentCourse?.value?.id,
        },
      });
      const articles = response.data;

      for (const article of articles) {
        traverseArticleParents(article);
      }

      courseArticles.value = articles;
    }
  }

  return {
    courseArticles,
    fetchArticles,
    courseNestedArticleArray,
    currentCourseArticle,
    pathToNestedArticle,
    articlesToSelect,
    breadCrumbItems,
  };
});
