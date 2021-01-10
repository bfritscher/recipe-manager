<template>
  <span>
    {{ modelValue }}
    <select v-model="hour" @change="updateDuration">
      <option v-for="h in hours" :key="h">{{ h }}</option>
    </select>
    <select v-model="minute" @change="updateDuration">
      <option v-for="m in minutes" :key="m">{{ m }}</option>
    </select>
  </span>
</template>
<script>
import moment from "moment";

export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }
    return {
      hours,
      minutes,
      hour: 0,
      minute: 0
    };
  },
  methods: {
    updateDuration() {
      const duration = moment.duration(`${this.hour}:${this.minute}`);
      this.$emit("update:modelValue", duration.toISOString());
    }
  },
  watch: {
    modelValue: {
      handler(iso8601Duration) {
        const duration = moment.duration(iso8601Duration);
        this.hour = duration.hours();
        this.minute = duration.minutes();
      },
      immediate: true
    }
  }
};
</script>
