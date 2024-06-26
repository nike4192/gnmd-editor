<script setup lang="ts">
import markdownit from "markdown-it";
import { ref, defineProps, onUpdated } from "vue";
import SelectButton from "primevue/selectbutton";
import Editor from "primevue/editor";

const md = markdownit();
const props = defineProps(["article"]);

const editorValue = ref("");

enum EditorMode {
  edit = "edit",
  preview = "preview",
}

const EditorModeLabels = {
  [EditorMode.edit]: "Edit",
  [EditorMode.preview]: "Preview",
};

const mode = ref(EditorMode.edit);
const modes = [EditorMode.edit, EditorMode.preview];
const editorRef = ref(null);

const updateEditorValue = () => {
  const { article } = props;
  editorValue.value = md.render(article.markdownBody);

  const instance = editorRef.value?.quill;
  if (instance) {
    instance.setContents(instance.clipboard.convert({ html: editorValue.value }));
  }
}

onUpdated(updateEditorValue);

</script>

<template lang="pug">
.article-editor-container
  SelectButton(
    v-model="mode"
    :options="modes"
    :option-label="(mode) => EditorModeLabels[mode]"
  )
  template(v-if="mode === EditorMode.edit")
    Editor.editor-container(
      ref="editorRef"
      v-model="editorValue"
      @load="updateEditorValue"
      :editor-style="{overflow: 'auto'}"
    )
</template>

<style lang="stylus">
.article-editor-container
  padding 8px
  display flex
  flex-direction column
  flex 1 1 auto
  overflow-y auto

  .editor-container
    margin-top: 8px;
    display flex
    flex-direction column
    overflow-y auto
</style>
