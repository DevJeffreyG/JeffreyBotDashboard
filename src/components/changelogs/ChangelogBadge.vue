<script setup lang="ts">
import { ChangeEnum } from "@/types/Changelog";
import MaterialIcon from "../buttons/MaterialIcon.vue";

const props = defineProps<{
  changeType: ChangeEnum;
}>();

function getIcon(changeType: ChangeEnum): string {
  switch (changeType) {
    case ChangeEnum.ADDED:
      return "add_circle";
    case ChangeEnum.UPDATED:
      return "change_circle";
    case ChangeEnum.REMOVED:
      return "delete";
    default:
      return "help";
  }
}

function getColor(changeType: ChangeEnum): string {
  switch (changeType) {
    case ChangeEnum.ADDED:
      return "var(--primary)";
    case ChangeEnum.UPDATED:
      return "#2483ff";
    case ChangeEnum.REMOVED:
      return "#ff3333";
    default:
      return "#9E9E9E";
  }
}
</script>

<template>
  <MaterialIcon
    thick
    :name="getIcon(props.changeType)"
    :color="getColor(props.changeType)"
  />
</template>
