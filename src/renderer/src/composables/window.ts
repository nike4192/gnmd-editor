import { useStorage } from "@vueuse/core/index";
import { computed } from "vue";

const maximizeIconClasses = [
  'pi-ticket',
  'pi-arrows-alt',
  'pi-credit-card',
  'pi-expand',
  'pi-hashtag',
  'pi-map',
  'pi-microchip',
  'pi-stop',
  'pi-table',
  'pi-tablet',
  'pi-window-maximize'
];


export function useWindowComposable() {
  const currentMaximizeIconIndex = useStorage<number>('current-maximize-icon-index', 0);

  const currentMaximizeIconClass = computed(() => maximizeIconClasses[currentMaximizeIconIndex.value])

  function nextMaximizeIconClass() {
    currentMaximizeIconIndex.value!++;
    if (currentMaximizeIconIndex.value >= maximizeIconClasses.length) {
      currentMaximizeIconIndex.value = 0;
    }
  }

  const minimizeApp = () => window.electron.ipcRenderer.send('minimize-app');
  const maximizeApp = () => window.electron.ipcRenderer.send('maximize-app');
  const closeApp = () => window.electron.ipcRenderer.send('close-app');

  return {
    currentMaximizeIconClass,
    nextMaximizeIconClass,
    minimizeApp,
    maximizeApp,
    closeApp
  }
}