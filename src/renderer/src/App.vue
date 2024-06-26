<script setup lang="ts">
import { computed, ref } from "vue";
import Badge from "primevue/badge";
import Toast from "primevue/toast";
import OverlayPanel from "primevue/overlaypanel";
import InputText from "primevue/inputtext";
import Menubar from "primevue/menubar";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import LoginDialog from "@app/components/LoginDialog.vue";
import { useAuthStore } from "@app/stores/auth";
import { storeToRefs } from "pinia";
import Menu from "primevue/menu";
import { useToast } from "primevue/usetoast";
import { useWindowComposable } from "@app/composables/window";
import { apiEndpoint, apiEndpointStatus } from "@app/composables/axios";

const authStore = useAuthStore();
const { profile } = storeToRefs(authStore);
const router = useRouter();

const toast = useToast();
const visible = ref(false);
const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    route: "/",
  },
  {
    label: "Courses",
    icon: "pi pi-th-large",
    route: "/courses",
  },
]);

const op = ref<Menu | null>(null);

const profileMenuRef = ref<Menu | null>(null);
const profileMenuItems = ref([
  {
    label: computed(() => profile.value?.login),
    items: [
      {
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        command: () => {
          authStore.logout();
          toast.add({ severity: 'success', summary: 'Sign out success', life: 3000 });
        }
      }
    ]
  }
]);

const toggleProfileMenu = (event: any) => {
  profileMenuRef.value?.toggle(event);
}

const {
  currentMaximizeIconClass,
  nextMaximizeIconClass,
  minimizeApp, maximizeApp, closeApp
} = useWindowComposable();

const toggleEndPoint = (event: any) => {
  op.value?.toggle(event);
}

function changeEndpoint (event: Event) {
  apiEndpoint.value = event.target?.value;
}

</script>

<template lang="pug">
Menubar(:model="items")
  template(#item="{ item, props }")
    router-link.p-menuitem-link(v-slot="{ href, navigate }" :to="item.route")
      span.p-menuitem-icon(:class="item.icon")
      span.ml-2(v-if="item.label") {{ item.label }}
  template(#end)
    .endpoint-status-container(@click="toggleEndPoint")
      Badge(:severity="apiEndpointStatus")
      OverlayPanel(ref="op")
        .flex.flex-column.w-20rem
          InputText(:value="apiEndpoint" @change="changeEndpoint")
    .user-avatar
      template(v-if="profile")
        Avatar(icon="pi pi-user" :label="profile.login[0].toUpperCase()" @click="toggleProfileMenu")
        Menu(ref="profileMenuRef" :model="profileMenuItems" :popup="true")
      template(v-else)
        Avatar(icon="pi pi-user" @click="visible = true")
    .window-buttons
      button(@click="minimizeApp" tabindex="-1")
        span.pi.pi-minus
      button(
        @click="maximizeApp"
        tabindex="-1"
        @mousedown="(e: MouseEvent) => { if (e.button == 2) nextMaximizeIconClass() }"
      )
        span.pi(:class="currentMaximizeIconClass")
      button(@click="closeApp" tabindex="-1")
        span.pi.pi-times

LoginDialog(v-model:visible='visible')
Toast(position="bottom-right")

router-view

</template>

<style lang="stylus">
html, body
  margin 0
  height 100%

.p-overlaypanel:before
  margin-left -20px

.p-overlaypanel:after
  margin-left -18px

/* width */
::-webkit-scrollbar
  width: 1rem;
  height: 1rem;

/* Track */
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner
  background: var(--surface-50);

/* Handle */
::-webkit-scrollbar-thumb
  background: var(--surface-100);
  box-shadow inset 0 0 0 0.25rem var(--surface-50)

/* Handle on hover */
::-webkit-scrollbar-thumb:hover
  background: var(--surface-200);

#app
  padding 8px
  height 100%
  display flex
  flex-direction column
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

.p-menubar
  -webkit-user-select: none;
  -webkit-app-region: drag;
  position relative

  .title-bar-end
    display flex
    gap 16px

  .p-menubar-end
    position: absolute
    top 0
    right 0
    height 100%
    display flex
    align-items center
    gap 1rem

    .endpoint-status-container
      padding 0.5rem

    .window-buttons
      height 100%

      & button
        height 100%
        width 48px
        background none
        border none

        &:hover
          background var(--surface-ground)

        &:last-child
          border-radius 0 6px 6px 0

          &:hover
            background var(--red-500)

.p-menubar *
  -webkit-app-region: no-drag;

.nav-link
  display inline-block
  padding 0 4px

.p-menubar .p-menuitem
  margin 0
</style>
