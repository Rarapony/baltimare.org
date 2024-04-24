<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useStore } from "@nanostores/vue";
import {
  updateData,
  avatarPosBaltimare,
  avatarPosHorseHeights,
  avatarPosObjBaltimare,
  avatarPosObjHorseHeights,
} from "../stores/store.js";
import parcels from "../data/parcels.js";

import { Tippy } from "vue-tippy";
import "tippy.js/dist/tippy.css";

import axios from "axios";

const $avatarPosBaltimare = useStore(avatarPosBaltimare);
const $avatarPosHorseHeights = useStore(avatarPosHorseHeights);
const $avatarPosObjBaltimare = useStore(avatarPosObjBaltimare);
const $avatarPosObjHorseHeights = useStore(avatarPosObjHorseHeights);

const $avatarPos = computed(() => {
  const baltimare = $avatarPosBaltimare.value.map((x) => ({
    ...x,
    location: "Baltimare",
  }));
  const horseHeights = $avatarPosHorseHeights.value.map((x) => ({
    ...x,
    location: "Horse Heights",
  }));
  return baltimare.concat(horseHeights);
});

const $avatarPosObj = computed(() => ({
  ...$avatarPosObjBaltimare.value,
  ...$avatarPosObjHorseHeights.value,
}));

updateData();

const magnify = (user) => {
  const pfp = document.getElementById(user.UUID);
  pfp.style.transition =
    "transform .3s ease-in-out, filter .3s ease-in-out, left 2s linear, bottom 2s linear, top 2s linear, right 2s linear";
  pfp.style.transform = "scale(1.75)";
  pfp.style.zIndex = 100000;
  pfp.style.filter = "drop-shadow(0 0 10px #ffcc00)";
  pfp.style.borderColor = "#ffcc00";
};

const demagnify = (user) => {
  const pfp = document.getElementById(user.UUID);
  pfp.style.transition =
    "transform .3s, filter .3s ease-in-out, left 2s linear, bottom 2s linear, top 2s linear 2s linear";
  pfp.style.transform = "scale(1)";
  pfp.style.zIndex = 10;
  pfp.style.filter = "";
  pfp.style.borderColor = "#ffffff";
};

const openDialog = (name) => {
  const dialog = document.getElementById(`dialog-${name}`);
  if (dialog instanceof HTMLDialogElement) {
    dialog.showModal();
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  }
};

const teleportToUser = (user) => {
  const URL = `secondlife://${
    user.location === "Baltimare" ? "BALTIMARE" : "HORSE HEIGHTS"
  }/${user.user_position[0] || 0}/${user.user_position[1] || 0}/${
    user.user_position[2] || 0
  }`;
  window.location.href = URL;
};
</script>

<template>
  <div
    style="filter: drop-shadow(0 2px 2px #000)"
    class="relative mx-4 w-full flex flex-col items-center justify-center rounded-lg"
  >
    <a
      target="_blank"
      href="https://boards.4chan.org/mlp/thread/41026390"
      class="w-full flex flex-col items-center justify-center cursor-pointer hover:opacity-40 duration-300"
    >
      <div class="text-blue-300 text-6xl uppercase font-semibold tracking-wide">
        <img
          src="../assets/baltimare.png?url"
          style="filter: drop-shadow(0 4px 4px #000)"
          width="700"
        />
      </div>
      <div
        class="-mt-32 text-blue-300 text-6xl uppercase font-semibold tracking-wide"
      >
        <img
          src="../assets/opg.png?url"
          style="filter: drop-shadow(0 4px 4px #000)"
          width="300"
        />
      </div>
    </a>
    <div class="w-4/5 relative flex rounded-lg mt-4">
      <img
        src="../assets/mapcropped3.png?url"
        class="w-full rounded-lg"
        usemap="#image-map"
        id="map"
      />
      <div v-for="(user, idx) in $avatarPos">
        <div
          v-if="
            user.user_name !== 'BaltiMare Resident' &&
            user.user_name !== 'HorseHeights Resident'
          "
          class="absolute flex flex-col items-center justify-center duration-[1500ms] z-50"
          :style="
            user.location === 'Baltimare'
              ? {
                  left:
                    50 +
                    ($avatarPosObj?.[user.UUID]?.user_position[0] / 256) * 50 +
                    '%',
                  bottom:
                    ($avatarPosObj?.[user.UUID]?.user_position[1] / 256) * 100 +
                    '%',
                }
              : {
                  left:
                    ($avatarPosObj?.[user.UUID]?.user_position[0] / 256) * 50 +
                    '%',
                  bottom:
                    ($avatarPosObj?.[user.UUID]?.user_position[1] / 256) * 100 +
                    '%',
                }
          "
          @mouseover="magnify(user)"
          @mouseout="demagnify(user)"
          @click="teleportToUser(user)"
          :id="user.UUID"
          :key="user.UUID"
        >
          <!-- <div class="text-xs text-center cursor-default text-neutral-800 font-semibold">
            {{ user.display_name.replace(" Resident", "") }}
          </div> -->
          <Tippy
            :content="`<div class='text-center'><h1 class='text-base font-medium'>${user.display_name.replace(
              ' Resident',
              ''
            )}</h1><h6 class='text-xs'>${user.user_name.replace(
              ' Resident',
              ''
            )}</h6></div>`"
            :allowHTML="true"
          >
            <img
              :src="`https://my-secondlife-agni.akamaized.net/users/${user.user_name
                .replace(' Resident', '')
                .replace(' ', '.')
                .toLowerCase()}/thumb_sl_image.png`"
              onerror="this.src='/twi.png'"
              class="cursor-pointer glow bg-white min-w-6 max-w-6 w-6 min-h-6 max-h-6 h-6 rounded-full border border-white shadow-2xl z-50 duration-[1500ms]"
            />
          </Tippy>
        </div>
      </div>
      <div
        v-for="parcel in parcels"
        :class="`cursor-pointer bg-white opacity-20 hover:opacity-75 border border-black absolute rounded duration-300`"
        :style="
          parcel.location === 'Baltimare'
            ? {
                left: 50 + (parcel.coords[0][0] * 50) / 256 + '%',
                bottom: (parcel.coords[0][1] * 100) / 256 + '%',
                width:
                  ((parcel.coords[3][0] - parcel.coords[0][0]) * 50) / 256 +
                  '%',
                height:
                  ((parcel.coords[1][1] - parcel.coords[0][1]) * 100) / 256 +
                  '%',
              }
            : {
                left: (parcel.coords[0][0] * 50) / 256 + '%',
                bottom: (parcel.coords[0][1] * 100) / 256 + '%',
                width:
                  ((parcel.coords[3][0] - parcel.coords[0][0]) * 50) / 256 +
                  '%',
                height:
                  ((parcel.coords[1][1] - parcel.coords[0][1]) * 100) / 256 +
                  '%',
              }
        "
        @click="openDialog(parcel.name)"
      ></div>
      <dialog
        :style="{ 'font-family': 'Poppins' }"
        class="p-0 cursor-default max-h-screen"
        v-for="parcel in parcels"
        :id="`dialog-${parcel.name}`"
      >
        <div
          class="block md:hidden absolute left-2 top-2 hover:bg-red-200 rounded-lg text-stone-600"
          id="close-m"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div
          class="overflow-hidden p-4 md:p-8 bg-blue-50 flex flex-col items-center justify-center w-full h-auto sm:w-120 md:w-160 lg:w-240 xl:w-288"
        >
          <div class="flex items-center justify-center w-1/2 my-8">
            <img
              :src="
                parcel.img ? `/${parcel.img}` : '/Feast_Hall_Preparations.png'
              "
              height="800"
              style="filter: drop-shadow(0 2px 2px #000)"
              class="w-auto h-48 sm:h-64 lg:h-auto lg:min-w-48 bg-white rounded-lg -rotate-3 p-4"
            />
          </div>
          <div class="flex flex-col gap-y-2 w-auto lg:ml-12">
            <div
              class="text-5xl lg:text-6xl xl:text-7xl text-center tracking-wide font-semibold uppercase"
            >
              {{ parcel.name }}
            </div>
            <div
              class="text-lg lg:text-xl xl:text-2xl text-center tracking-wide font-medium uppercase"
            >
              Owned by <span class="text-neutral-500">{{ parcel.owner }}</span>
            </div>
            <a
              style="filter: drop-shadow(0 1px 1px #000)"
              :href="`secondlife://BALTIMARE/${parcel?.teleport?.[0] || 0}/${
                parcel?.teleport?.[1] || 0
              }/${parcel?.teleport?.[2] || 0}`"
              class="text-xl tracking-wide rounded bg-blue-400 hover:bg-blue-600 duration-200 text-center mx-auto px-3 py-1 uppercase text-white cursor-pointer"
            >
              Teleport here
            </a>
          </div>
          <div class="my-8 flex flex-col w-full xl:w-full lg:ml-12">
            <div
              class="md:py-0 text-xl lg:text-2xl xl:text-3xl text-center tracking-wide font-semibold uppercase"
            >
              Current occupants:
              {{
                $avatarPos.filter(
                  (u) =>
                    u.location === parcel.location &&
                    u.user_position[0] >= parcel.coords[0][0] &&
                    u.user_position[0] <= parcel.coords[3][0] &&
                    u.user_position[1] >= parcel.coords[0][1] &&
                    u.user_position[1] <= parcel.coords[1][1]
                ).length
              }}
            </div>
            <div class="mt-4 grid grid-cols-5 gap-x-6 gap-y-0">
              <div
                class="flex gap-x-1 items-center whitespace-nowrap"
                v-for="user in $avatarPos.filter(
                  (u) =>
                    u.user_position[0] >= parcel.coords[0][0] &&
                    u.user_position[0] <= parcel.coords[3][0] &&
                    u.user_position[1] >= parcel.coords[0][1] &&
                    u.user_position[1] <= parcel.coords[1][1]
                )"
              >
                <img
                  :src="user.pfp"
                  class="w-4 h-4 rounded"
                  onerror="this.src='/twi.png'"
                />
                <span class="text-sm">{{ user.display_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
    <div
      :class="`absolute ${$avatarPos.length > 40 ? '-right-80' : '-right-48'} ${
        $avatarPos.length ? '' : 'w-72'
      } rounded-2xl mt-4 mx-4 px-4 py-4 bg-amber-50 rotate-3`"
      style="font-family: 'Poppins'; filter: drop-shadow(0 2px 2px #000)"
    >
      <div class="text-2xl text-black font-semibold text-center">
        <span class="font-semibold uppercase">Online: </span>
        <span class="font-semibold">{{
          $avatarPos.length ? $avatarPos.length - 2 : "?"
        }}</span>
        / 220
      </div>
      <div class="my-1 flex flex-col items-center">
        <div class="text-sm text-black font-normal text-center">
          <span class="font-medium uppercase">Baltimare: </span>
          <span class="font-normal">{{
            $avatarPos.filter((x) => x.location === "Baltimare").length - 1
          }}</span> / 110
        </div>
        <div class="text-sm text-black font-normal text-center">
          <span class="font-medium uppercase">Horse Heights: </span>
          <span class="font-normal">{{
            $avatarPos.filter((x) => x.location === "Horse Heights").length - 1
          }}</span> / 110
        </div>
      </div>
      <div
        v-if="$avatarPos.length"
        :class="`${
          $avatarPos.length > 40 ? 'max-w-120 columns-2' : 'w-64 columns-1'
        }`"
      >
        <div
          v-for="(user, idx) in $avatarPos.filter(
            (u) =>
              u.display_name !== 'BaltiMare' &&
              u.display_name !== 'Builder Pony'
          )"
          @mouseover="magnify(user)"
          @mouseout="demagnify(user)"
          @click="teleportToUser(user)"
          class="w-full"
        >
          <div
            class="w-auto whitespace-nowrap rounded hover:bg-neutral-800 text-black hover:text-amber-50 px-1 duration-300 cursor-pointer font-medium gap-x-2 flex items-center justify-start"
          >
            <img
              :src="user.pfp"
              class="w-4 h-4 rounded"
              onerror="this.src='/twi.png'"
            />
            <span class="text-sm font-medium">
              {{ user.display_name.replace(" Resident", "") }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-else
        class="min-h-80 flex flex-col items-center justify-center text-center"
      >
        <img src="../assets/twi.gif?url" />
        <div class="text-center mt-1 text-lg">Loading users...</div>
      </div>
    </div>
  </div>
</template>
