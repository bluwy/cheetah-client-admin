<template>
  <v-dialog :value="value" persistent width="400">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
    <v-card>
      <v-card-title>Create Staff</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            label="Username"
            spellcheck="false"
          ></v-text-field>
          <v-text-field
            v-model="fullName"
            :rules="fullNameRules"
            label="Full Name"
            spellcheck="false"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :type="passwordShow ? 'text' : 'password'"
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            spellcheck="false"
            @click:append="passwordShow = !passwordShow"
          ></v-text-field>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <dialog-yes-no
          v-model="cancelDialog"
          header="Are you sure?"
          message="You cannot undo this action."
          @yes="confirmCancel"
        >
          <template #activator>
            <v-btn outlined color="error" @click.stop="cancel">Cancel</v-btn>
          </template>
        </dialog-yes-no>
        <v-btn color="primary" @click="create">Create</v-btn>
      </v-card-actions>
    </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import DialogYesNo from './DialogYesNo.vue'
import { required, minLength, maxLength } from '@/utils/inputRules'

export default {
  name: 'DialogCreateStaff',
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    valid: false,
    username: '',
    usernameRules: [required, maxLength(16)],
    fullName: '',
    fullNameRules: [required, maxLength(128)],
    password: '',
    passwordRules: [required, minLength(8)],
    passwordShow: false,
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      return !!(this.username || this.fullName || this.password)
    }
  },
  methods: {
    cancel () {
      if (this.isDirty) {
        this.cancelDialog = true
      } else {
        this.confirmCancel()
      }
    },
    confirmCancel () {
      this.username = ''
      this.fullName = ''
      this.password = ''

      this.$emit('input', false)
    },
    create () {
      if (this.$refs.form.validate()) {
        // Create staff
      }
    }
  }
}
</script>

<style>
</style>
