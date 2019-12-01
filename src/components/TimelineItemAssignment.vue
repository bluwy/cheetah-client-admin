<template>
  <v-timeline-item right fill-dot small>
    <div class="py-1">{{ formatCheckTime }}</div>
    <v-card class="assignment-card" outlined style="background-color: rgba(0, 0, 0, .02)">
      <v-card-text>
        <v-chip
          v-for="(staff, i) in staffs"
          :key="i"
          class="mr-2"
        >
          {{ staff.username }}
        </v-chip>
      </v-card-text>
      <v-card-text class="pt-0">
        <v-card-title class="subtitle-1 black--text pa-0">Tasks</v-card-title>
        <ul class="assignment-card__list">
          <li v-show="!tasks || !tasks.length" key="empty">No tasks</li>
          <li v-for="(task, i) in tasks" :key="i">
            <v-chip small label class="mr-2">{{ task.type }}</v-chip>
            <span>{{ task.remarks }}</span>
          </li>
        </ul>
      </v-card-text>
      <v-card-text class="pt-0">
        <v-card-title class="subtitle-1 black--text pa-0">Actions</v-card-title>
        <ul class="assignment-card__list">
          <li v-show="!actions || !actions.length" key="empty">No actions</li>
          <li v-for="(action, i) in actions" :key="i">
            <v-chip small label class="mr-2">{{ action.type }}</v-chip>
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
      type: Number
    },
    checkOut: {
      type: Number
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
    }
  },
  computed: {
    formatCheckTime () {
      if (this.checkIn == null) {
        return 'Not started'
      }

      const text = [
        format(this.checkIn, 'd MMM yyyy'),
        format(this.checkIn, 'HHmm'),
        '-'
      ]

      if (this.checkOut == null) {
        text.push('now')
      } else {
        text.push([
          isSameDay(this.checkIn, this.checkOut) ? '' : format(this.checkOut, 'd MMM yyyy'),
          format(this.checkOut, 'HHmm')
        ])
      }

      return text.filter(v => !!v).join(' ')
    }
  }
}
</script>

<style scoped>
/* Make timeline divider thinner */
.v-timeline-item >>> .v-timeline-item__divider {
  min-width: 24px;
}

.v-timeline-item >>> .v-timeline-item__body {
  max-width: calc(100% - 24px);
  padding-left: 16px;
}

/* Remove arrow from timeline */
.assignment-card::before, .assignment-card::after {
  display: none;
}

.assignment-card__list {
  list-style-type: none;
  padding-left: 0;
}
</style>
