<template>
  <v-dialog :value="value" persistent width="700">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>Create Customer</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <v-subheader>General</v-subheader>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="code"
                  label="Code"
                ></v-text-field>
                <v-text-field
                  v-model="name"
                  label="Name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <v-subheader>Description</v-subheader>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="address"
                  label="Address"
                ></v-text-field>
                <v-text-field
                  v-model="phoneNumber"
                  label="Phone Number"
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  label="Email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <v-subheader>Person in charge</v-subheader>
              </v-col>
              <v-col cols="12" md="8">
                <input-staff v-model="staff"></input-staff>
              </v-col>
            </v-row>
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
import InputStaff from './InputStaff'

export default {
  name: 'DialogCreateCustomer',
  components: {
    DialogYesNo,
    InputStaff
  },
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    valid: false,
    code: '',
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    staff: null,
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      return !!(this.code || this.name || this.address || this.phoneNumber || this.email || this.staff)
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
      this.code = ''
      this.name = ''
      this.address = ''
      this.phoneNumber = ''
      this.email = ''
      this.staff = null

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
