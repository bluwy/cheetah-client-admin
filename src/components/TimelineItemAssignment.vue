<template>
  <v-timeline-item
    right
    fill-dot
    small
    :color="themeColor"
  >
    <div class="py-1">
      {{ formatCheckTime }}
    </div>
    <v-card
      class="assignment-card"
      outlined
      :style="{
        'background-color': themeColorHex + '12',
        'border-color': themeColorHex
      }"
    >
      <v-card-text>
        <v-chip
          v-for="(staff, i) in staffs"
          :key="i"
          class="mr-2"
          :color="themeColor"
        >
          {{ staff.username }}
        </v-chip>
      </v-card-text>
      <v-card-text class="pt-0">
        <v-card-title class="subtitle-1 black--text pa-0">
          Tasks
        </v-card-title>
        <ul class="assignment-card__list">
          <li
            v-show="!tasks || !tasks.length"
            key="empty"
          >
            No tasks
          </li>
          <li
            v-for="(task, i) in tasks"
            :key="i"
            class="mb-1"
          >
            <v-chip
              small
              label
              class="mr-2"
              :color="themeColor"
            >
              {{ task.type }}
            </v-chip>
            <span>{{ task.remarks }}</span>
          </li>
        </ul>
      </v-card-text>
      <v-card-text class="pt-0">
        <v-card-title class="subtitle-1 black--text pa-0">
          Actions
        </v-card-title>
        <ul class="assignment-card__list">
          <li
            v-show="!actions || !actions.length"
            key="empty"
          >
            No actions
          </li>
          <li
            v-for="(action, i) in actions"
            :key="i"
            class="mb-1"
          >
            <v-chip
              small
              label
              class="mr-2"
              :color="themeColor"
            >
              {{ action.type }}
            </v-chip>
            <span>{{ action.remarks }}</span>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-timeline-item>
</template>

<script>
import { format, isSameDay } from 'date-fns'

export default {
  name: 'TimelineItemAssignment',
  props: {
    checkIn: {
      type: Number,
      default: null
    },
    checkOut: {
      type: Number,
      default: null
    },
    staffs: {
      type: Array,
      default: () => [],
      validator: val => val.every(staff => 'username' in staff)
    },
    tasks: {
      type: Array,
      default: () => [],
      validator: val => val.every(task => 'type' in task && 'remarks' in task)
    },
    actions: {
      type: Array,
      default: () => [],
      validator: val => val.every(action => 'type' in action && 'remarks' in action)
    },
    needsFollowUp: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    themeColor () {
      if (this.checkIn == null) {
        // Haven't started
        return 'primary'
      } else if (this.checkOut == null) {
        // In progress
        return 'warning'
      } else if (this.needsFollowUp) {
        return 'error'
      } else {
        return 'success'
      }
    },
    themeColorHex () {
      return this.$vuetify.theme.themes.light[this.themeColor]
    },
    formatCheckTime () {
      if (this.checkIn == null) {
        return 'Not started'
      }

      const text = [
        format(this.checkIn, 'd MMM yyyy'),
        format(this.checkIn, 'HH:mm'),
        '-'
      ]

      if (this.checkOut == null) {
        text.push('now')
      } else {
        text.push(
          isSameDay(this.checkIn, this.checkOut) ? '' : format(this.checkOut, 'd MMM yyyy'),
          format(this.checkOut, 'HH:mm')
        )
      }

      return text.filter(v => !!v).join(' ')
    }
  }
}
</script>

<style scoped>
/* Remove arrow from timeline */
.assignment-card::before, .assignment-card::after {
  display: none;
}

.assignment-card__list {
  list-style-type: none;
  padding-left: 0;
}
</style>
