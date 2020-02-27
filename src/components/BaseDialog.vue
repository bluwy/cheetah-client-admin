<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="ok()"
  >
    <v-dialog
      v-bind="mergedDialogProps"
      :persistent="isDirty"
      v-on="$listeners"
    >
      <v-card v-bind="cardProps">
        <v-toolbar flat>
          <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
          <v-spacer />
          <slot name="toolbar" />
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
          <v-btn
            icon
            color="primary"
            @click="cancel()"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <slot />
        </v-card-text>
        <v-card-actions v-if="showActions">
          <v-spacer />
          <dialog-yes-no
            v-model="dialogCancel"
            v-bind="mergedYesNoProps"
            @yes="cancel(true)"
          />
          <slot name="actions" />
          <v-btn
            outlined
            color="error"
            @click.stop="cancel()"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import { merge } from 'lodash-es'

/**
 * Slots:
 * - default
 * - toolbar
 * - actions
 *
 * Events:
 * - close -> on before dialog close
 * - ok -> auto validate and check dirty
 * - update:isEditing -> for sync
 */
export default {
  name: 'BaseDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    cardProps: {
      type: Object,
      default: () => ({})
    },
    yesNoProps: {
      type: Object,
      default: () => ({})
    },
    dialogTitle: {
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
    valid: false,
    dialogCancel: false
  }),
  computed: {
    mergedDialogProps () {
      return merge({
        width: 400,
        maxWidth: '95vw'
      }, this.$attrs)
    },
    mergedYesNoProps () {
      return merge({
        header: 'Are you sure?',
        message: 'Data you have entered are not saved'
      }, this.yesNoProps)
    }
  },
  watch: {
    // Convenience for on close event to reduce boilerplate
    value (val) {
      if (!val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    cancel (force) {
      if (!force && this.isDirty) {
        this.dialogCancel = true
      } else {
        this.$emit('input', false)
      }
    },
    ok () {
      if (this.$refs.form.validate() && this.valid && this.isDirty) {
        this.$emit('ok')
        // Don't close dialog, the form may need to be cache before closing.
        // This will be delegated to the ok event.
      }
    }
  }
}
</script>
