<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="updateStaff()"
  >
    <v-dialog
      :persistent="isDirty"
      width="400"
      max-width="95vw"
    >
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Staff Info</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            color="primary"
          >
            <v-icon @click="$emit('input', false)">
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="newFormStaff.username"
              :rules="rule.username"
              :loading="!!loadingCount"
              label="Username"
              spellcheck="false"
            />
            <v-text-field
              v-model="newFormStaff.fullName"
              :rules="rule.fullName"
              :loading="!!loadingCount"
              label="Full Name"
              spellcheck="false"
            />
            <v-text-field
              v-model="newFormStaff.active"
              :rules="rule.fullName"
              :loading="!!loadingCount"
              label="Full Name"
              spellcheck="false"
            />
          </v-container>
        </v-card-text>
        <v-card-actions v-show="isDirty">
          <v-spacer />
          <dialog-yes-no
            v-model="dialogClose"
            header="Are you sure?"
            message="Data you have entered are not saved"
            @yes="close(true)"
          />
          <v-btn
            outlined
            color="error"
            @click.stop="close()"
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
import { isEqual, merge } from 'lodash-es'
import { updatedDiff } from 'deep-object-diff'
import { cacheObjKeys } from '@/utils/common'
import { required, maxStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_UPDATE from '@/graphql/Staff/Update.graphql'
import STAFF_GET_ONE from '@/graphql/Staff/GetOne.graphql'

const formStaffFactory = () => ({
  username: '',
  fullName: '',
  password: ''
})

export default {
  name: 'StaffDialogUpdate',
  apollo: {
    staff: {
      query: STAFF_GET_ONE,
      variables () {
        return {
          id: this.staffId
        }
      },
      skip () {
        return !this.staffId
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    DialogYesNo
  },
  data: () => ({
    valid: false,
    loadingCount: 0,
    // Staff from server
    staffId: '',
    staff: {},
    // Staff to be edited by form
    formStaffFactory: () => ({}),
    formStaff: formStaffFactory(),
    oriFormStaff: {},
    newFormStaff: {},
    rule: {
      username: [required, maxStrLength(16)],
      fullName: [required, maxStrLength(128)]
    },
    dialogClose: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formStaff, formStaffFactory())
    }
  },
  watch: {
    staff (val) {
      this.formStaffFactory = () => ({
        username: val.username,
        fullName: val.fullName,
        active: val.active
      })

      this.reset()
    }
  },
  methods: {
    open (staffId) {
      this.staffId = staffId
      this.$emit('input', true)
    },
    close (force) {
      if (!force && this.isDirty) {
        this.dialogClose = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.oriFormStaff = this.formStaffFactory()
      this.newFormStaff = this.formStaffFactory()
      this.$refs.form.resetValidation()
    },
    async updateStaff () {
      if (this.$refs.form.validate() && this.isDirty) {
        const diff = updatedDiff(this.oriFormStaff, this.newFormStaff)

        const { cache, restore } = cacheObjKeys(this, ['staffId', 'oriFormStaff', 'newFormStaff'])

        const optimisticResponse = {
          updateStaff: merge({}, this.staff, diff)
        }

        this.close(true)

        snackbarPush({ color: 'success', message: 'Updated staff' })

        try {
          await this.$apollo.mutate({
            mutation: STAFF_UPDATE,
            variables: {
              id: cache.staffId,
              ...diff
            },
            optimisticResponse
          })
        } catch (e) {
          console.error(e)

          restore()

          this.open(cache.staffId)

          snackbarPush({ color: 'error', message: 'Unable to update staff' })
        }
      }
    }
  }
}
</script>

<style>
</style>
