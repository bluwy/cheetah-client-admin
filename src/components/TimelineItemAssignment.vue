<template>
  <v-timeline-item
    right
    fill-dot
    small
    :color="themeColor"
  >
    <div
      v-if="expired"
      class="py-1"
    >
      Expired, new assignment below
    </div>
    <div
      v-else
      class="py-1"
    >
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
      <v-card-text
        v-if="formatPreferTime"
        class="pb-0"
      >
        {{ formatPreferTime }}
      </v-card-text>
      <v-card-text class="pb-0">
        <v-chip
          v-if="staffPrimary"
          class="mr-2"
          :color="themeColor"
        >
          {{ staffPrimary && staffPrimary.username }}
        </v-chip>
        <v-chip
          v-if="staffSecondary"
          class="mr-2"
          :color="themeColor"
        >
          {{ staffSecondary && staffSecondary.username }}
        </v-chip>
      </v-card-text>
      <v-card-text class="pb-0">
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
      <v-card-text>
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
    preferTime: {
      type: String,
      default: null
    },
    checkIn: {
      type: String,
      default: null
    },
    checkOut: {
      type: String,
      default: null
    },
    expired: {
      type: Boolean,
      default: null
    },
    staffPrimary: {
      type: Object,
      default: null
    },
    staffSecondary: {
      type: Object,
      default: null
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
    }
  },
  computed: {
    themeColor () {
      if (this.expired) {
        // Has been re-assigned
        return 'error'
      } else if (this.checkIn == null) {
        // Haven't started
        return 'primary'
      } else if (this.checkOut == null) {
        // In progress
        return 'warning'
      } else {
        return 'success'
      }
    },
    themeColorHex () {
      return this.$vuetify.theme.themes.light[this.themeColor]
    },
    formatPreferTime () {
      if (this.preferTime == null) {
        return ''
      } else {
        return 'Preferred time: ' + format(new Date(this.preferTime), 'd MMM yyyy HH:mm')
      }
    },
    formatCheckTime () {
      if (this.checkIn == null) {
        return 'Not started'
      }

      const text = [
        format(new Date(this.checkIn), 'd MMM yyyy'),
        format(new Date(this.checkIn), 'HH:mm'),
        '-'
      ]

      if (this.checkOut == null) {
        text.push('now')
      } else {
        text.push(
          isSameDay(new Date(this.checkIn), new Date(this.checkOut)) ? '' : format(new Date(this.checkOut), 'd MMM yyyy'),
          format(new Date(this.checkOut), 'HH:mm')
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
