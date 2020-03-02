<template>
  <v-menu
    v-model="menu"
    offset-y
  >
    <template #activator="scope">
      <slot
        name="activator"
        v-bind="scope"
      >
        <v-btn
          v-bind="buttonProps"
          @click.stop="buttonClick()"
        >
          <slot name="button">
            {{ buttonText }}
          </slot>
        </v-btn>
      </slot>
    </template>
    <v-list>
      <v-list-item @click.stop="confirm()">
        <v-list-item-title>
          <slot name="confirm">
            {{ confirmText }}
          </slot>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'ButtonConfirm',
  props: {
    skipConfirm: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: 'button'
    },
    confirmText: {
      type: String,
      default: 'confirm'
    },
    buttonProps: {
      type: Object,
      default: undefined
    }
  },
  data: () => ({
    menu: false
  }),
  methods: {
    buttonClick () {
      if (this.skipConfirm) {
        this.confirm()
      } else {
        this.menu = true
      }
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>
