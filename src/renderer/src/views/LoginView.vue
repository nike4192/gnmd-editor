<script setup lang="ts">

import { ref } from "vue";
import Password from 'primevue/password';

const credentials = ref({
  username: null,
  password: null,
})

</script>

<template lang="pug">
.login-view
  FloatLabel
    Password(
      input-id="password"
      v-model="credentials.password"
      :feedback="false"
    )
    label(for="password")
</template>

<style scoped lang="stylus">

</style>