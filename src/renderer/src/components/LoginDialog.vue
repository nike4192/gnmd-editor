<script setup lang="ts">
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { onMounted, onUpdated, ref } from "vue";
import * as yup from 'yup';

import type { Credentials } from "@app/stores/auth";
import { UnauthorizedError, useAuthStore } from "@app/stores/auth";
import LogoIconWhite from "@app/assets/icons/logo_204x36_white.svg"
import { useToast } from "primevue/usetoast";
import { useForm } from "vee-validate";

const schema = yup.object({
  login: yup.string().required(),
  password: yup.string().required(),
});

const { defineField, validate, values, errors, setErrors, handleReset } = useForm({
  validationSchema: schema
});
const [login, loginAttrs] = defineField('login');
const [password, passwordAttrs] = defineField('password');

const toast = useToast();
const authStore = useAuthStore();

async function onKeydown(event: KeyboardEvent, closeCallback: () => void) {
  if (event.key === 'Enter') {
    await onSubmit(closeCallback);
  }
}

async function onSubmit(closeCallback: () => void) {
  const result = await validate();
  if (result.valid) {
    try {
      await authStore.login(values as any);
      toast.add({ severity: 'success', summary: 'Authorized', life: 3000 });
      handleReset();
      setErrors({})
      closeCallback();
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        toast.add({ severity: 'error', summary: 'Unauthorized', detail: "Wrong login or password", life: 3000 });
      }
    }
  }
}

onUpdated(() => {
  setErrors({});
})

</script>

<template lang="pug">
Dialog.login-dialog(
  modal
  :dismissable-mask="true"
  :pt="{\
    root: 'border-none',\
    mask: {\
      style: 'backdrop-filter: blur(2px)'\
    }\
  }"
)
  template(#container='{ closeCallback }')
    .flex.flex-column.px-5.py-5.gap-4(style='border-radius: 12px;' v-focustrap)
      LogoIconWhite.block.mx-auto.my-2(height="32")
      .inline-flex.flex-column.gap-2
        label.text-primary-50.font-semibold(for='username')
          | Username
        InputText#username.bg-white-alpha-20.border-none.p-3.text-primary-50.w-20rem(
          autofocus
          :pt="{ \
            root: { \
              ...loginAttrs,\
              onKeydown: (e) => onKeydown(e, closeCallback) \
            } \
          }"
          v-model="login"
        )
        small.text-red-500.h-1rem {{ errors.login }}
      .inline-flex.flex-column.gap-2
        label.text-primary-50.font-semibold(for='password')
          | Password
        InputText#password.bg-white-alpha-20.border-none.p-3.text-primary-50.w-20rem(
          :pt="{ \
            root: { \
              ...passwordAttrs,\
              onKeydown: (e) => onKeydown(e, closeCallback) \
            } \
          }"
          v-model="password",
          type="password"
        )
        small.text-red-500.h-1rem {{ errors.password }}
      .flex.align-items-center.gap-3
        Button.p-3.w-full.text-primary-50.border-1.border-white-alpha-30(
          class='hover:bg-white-alpha-10',
          @click='closeCallback',
          label='Cancel',
          text='',
        )
        Button.p-3.w-full.text-primary-50.border-1.border-white-alpha-30(
          class='hover:bg-white-alpha-10'
          @click='onSubmit(closeCallback)',
          label='Sign-In',
          text='',
        )

</template>

<style lang="stylus">

</style>