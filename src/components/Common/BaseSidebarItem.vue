<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      color="primary lighten-5"
      hide-actions
    >
      <span>{{ itemTitle }}</span>
      <v-spacer />
      <slot name="header" />
      <v-btn
        v-if="isEditable"
        :input-value="isEditing"
        icon
        color="warning"
        @click="$emit('update:isEditing', !isEditing)"
      >
        <v-icon>
          mdi-pencil
        </v-icon>
      </v-btn>
      <button-confirm
        :skip-confirm="!isDirty"
        :button-props="{ class: 'flex-grow-0', icon: true }"
        button-text="Cancel"
        confirm-text="Confirm?"
        @confirm="close()"
      >
        <template #button>
          <v-icon>
            mdi-close
          </v-icon>
        </template>
      </button-confirm>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="ok()"
      >
        <slot />
        <v-row
          v-if="showActions"
          no-gutters
        >
          <v-spacer />
          <slot name="actions" />
          <button-confirm
            :skip-confirm="!isDirty"
            button-text="Cancel"
            confirm-text="Confirm?"
            @confirm="close()"
          />
          <v-btn
            class="ml-3"
            type="submit"
            color="primary"
          >
            OK
          </v-btn>
        </v-row>
      </v-form>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import ButtonConfirm from '@/components/Common/ButtonConfirm.vue'

/**
 * Slots:
 * - default
 * - header
 * - actions
 *
 * Events:
 * - ok -> auto validate and check dirty
 * - close -> Remove from sidebar
 * - hide -> Don't display in sidebar, but still persist
 * - unhide -> Opposite of above
 * - update:isEditing -> for sync
 */
export default {
  name: 'BaseSidebarItem',
  components: {
    ButtonConfirm
  },
  props: {
    itemTitle: {
      type: String,
      default: ''
    },
    showActions: {
      type: Boolean,
      default: false
    },
    isDirty: {
      type: Boolean,
      default: false
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    valid: false
  }),
  methods: {
    hide () {
      this.$emit('hide')
    },
    unhide () {
      this.$emit('unhide')
    },
    close () {
      this.$emit('close')
    },
    ok () {
      if (this.$refs.form.validate() && this.valid && this.isDirty) {
        this.$emit('ok')
      }
    }
  }
}
</script>
