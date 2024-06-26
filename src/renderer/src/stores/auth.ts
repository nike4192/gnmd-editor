import { defineStore } from "pinia";
import { useAxios } from "@app/composables/axios";
import { ref } from "vue";
import { AxiosError } from "axios";

interface UserProfile {
  createdAt : string,
  email : string,
  login : string,
  permissionLevel : number,
  provider : string,
  role : string,
  updatedAt : string,
  uuid : string,
}

export interface Credentials {
  login: string | null
  password: string | null
}

export class UnauthorizedError extends AxiosError {}

export const useAuthStore = defineStore("auth", () => {
  const { axiosInstance } = useAxios();

  const profile = ref<UserProfile | null>(null);

  async function login(credentials: Credentials): Promise<UserProfile | null | undefined> {
    try {
      const result = await axiosInstance.post('/auth', credentials);
      profile.value = result.data;
      return profile.value;
    } catch (e) {
      if (e instanceof AxiosError && [400, 401, 404].includes(e.response?.status!)) {
        profile.value = null;
        throw new UnauthorizedError();
      } else {
        throw e;
      }
    }
  }

  async function logout() {
    if (profile.value && profile.value.uuid) {
      try {
        await axiosInstance.get('/profile/logout/' + profile.value.uuid);
        profile.value = null;
        return true;
      } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 401) {
          profile.value = null;
          throw new UnauthorizedError();
        } else {
          throw e;
        }
      }
    }
  }

  async function fetchProfile() {
    try {
      const result = await axiosInstance.get('/profile');
      profile.value = result.data;
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 401) {
        profile.value = null;
      } else {
        throw e;
      }
    }
  }

  return {
    login,
    logout,
    profile,
    fetchProfile,
  }
})
