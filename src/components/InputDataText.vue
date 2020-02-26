<template>
  <v-text-field
    ref="textField"
    v-model="editText"
    v-bind="$attrs"
    class="text-field"
    outlined
    single-line
    dense
    @click.stop="!isEdit && startEdit()"
    @blur="cancelEdit()"
    @keyup.esc="cancelEdit()"
    @keyup.enter="confirmEdit()"
  >
    <template #append-outer>
      <v-icon
        v-if="!isEdit"
        class="text-field__edit"
        small
        color="primary"
        @click.stop="startEdit()"
      >
        mdi-pencil
      </v-icon>
      <template v-else>
        <v-btn
          icon
          small
          color="success"
          @click.stop="confirmEdit()"
        >
          <v-icon>
            mdi-check
          </v-icon>
        </v-btn>
        <v-btn
          icon
          small
          color="error"
          @click.stop="cancelEdit()"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'InputDataText',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    isEdit: false,
    editText: ''
  }),
  computed: {
    isDirty () {
      return this.editText !== this.value
    }
  },
  watch: {
    value (val) {
      this.editText = val
    }
  },
  methods: {
    startEdit () {
      this.isEdit = true
      this.$refs.textField.focus()
    },
    cancelEdit () {
      this.isEdit = false
      this.editText = this.value
    },
    confirmEdit () {
      this.isEdit = false
      this.$emit('update', this.editText)
    }
  }
}
</script>

<style scoped>
.text-field .text-field__edit {
  opacity: 0;
}

.text-field:hover .text-field__edit {
  opacity: .8;
}
</style>
