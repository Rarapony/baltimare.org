<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useStore } from "@nanostores/vue";
import { updateBans, bans } from "../stores/bansStore.js";

updateBans();

const $bans = useStore(bans);

const from = ref("2022-07-08");
const to = ref("2024-04-30");

const janny = ref("");

const filteredBans = computed(() => {
  const startDate = new Date(from.value);
  const endDate = new Date(to.value);

  return $bans.value
    .filter((b) =>
      janny.value !== ""
        ? b.jannyUsername
            .replace(" Resident", "")
            .toUpperCase()
            .includes(janny.value.toUpperCase())
        : b
    )
    .filter((ban) => {
      const dateBanned = new Date(ban.dateBanned);
      return dateBanned <= endDate && dateBanned >= startDate;
    })
    .sort((x, y) => {
      return x.dateBanned > y.dateBanned
        ? -1
        : x.dateBanned < y.dateBanned
        ? 1
        : 0;
    });
});
const getUTCTimestamp = (d) => {
  const temp = d.toISOString().split("T");
  const date = temp[0];
  const time = temp[1].split(".")[0];

  return `${date} ${time} PST`;
};
</script>

<template>
  <div
    class="w-5/6 lg:w-3/5 lg:my-0 my-8 p-4 lg:p-8 glass flex flex-col items-center justify-center text-black"
  >
    <div>
      <div
        class="text-center uppercase text-4xl lg:text-8xl font-semibold tracking-wide"
      >
        Bans
      </div>
    </div>
    <div class="my-4 flex items-center justify-center gap-x-8 text-sm">
      <div class="font-medium">
        Janny: <input v-model="janny" class="rounded px-1" />
      </div>
      <div class="font-medium">
        From:
        <input
          v-model="from"
          type="date"
          min="0"
          max="11"
          class="rounded px-1"
        />
      </div>
      <div class="font-medium">
        To:
        <input v-model="to" type="date" min="0" max="11" class="rounded px-1" />
      </div>
    </div>
    <table
      class="overflow-y-scroll min-h-120 h-120 max-h-120 block"
      v-if="$bans.length"
    >
      <tr class="text-sm font-bold">
        <th class="w-64 text-left">Banned user</th>
        <th class="w-64 text-left">Banned by</th>
        <th class="w-40 text-center">Ban date</th>
        <!-- <th class="w-24 text-center">Last login</th> -->
      </tr>
      <tr class="text-xs font-medium" v-for="ban in filteredBans">
        <td>{{ ban.username.replace(" Resident", "") }}</td>
        <td>{{ ban.jannyUsername.replace(" Resident", "") }}</td>
        <td class="font-mono text-center font-bold">
          {{ getUTCTimestamp(new Date(ban.dateBanned)) }}
        </td>
        <!-- <td class="font-mono text-center font-bold">
          {{ new Date(ban.lastLogin).toISOString().split("T")[0] }}
        </td> -->
      </tr>
    </table>
    <div
      v-else
      class="text-2xl min-h-120 h-120 max-h-120 flex flex-col items-center justify-center font-medium"
    >
      <img class="max-w-80" src="../assets/twi.gif?url" />
      <div class="my-4">Loading...</div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Scrollbar CSS ===== */
/* Firefox */
*::-webkit-scrollbar {
  background-color: #999;
  width: 8px;
}

/* background of the scrollbar except button or resizer */
*::-webkit-scrollbar-track {
  background-color: #999;
  /* border-radius: 16px; */
}

/* scrollbar itself */
*::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 16px;
  border: 2px solid #999;
}

/* set button(top and bottom of the scrollbar) */
*::-webkit-scrollbar-button {
  display: none;
}
</style>
