<template>
  <v-dialog
    v-bind="$attrs"
    persistent
    width="400"
    max-width="95vw"
    v-on="$listeners"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="updateStaff()"
    >
      <v-card>
        <v-card-title>Edit Staff</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="newFormStaff.username"
              :rules="rule.username"
              label="Username"
              spellcheck="false"
            />
            <v-text-field
              v-model="newFormStaff.fullName"
              :rules="rule.fullName"
              label="Full Name"
              spellcheck="false"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
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
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { isEqual, merge, cloneDeep } from 'lodash-es'
import { updatedDiff } from 'deep-object-diff'
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys, restoreObjKeys } from '@/utils/common'
import { required, maxStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_GET from '@/graphql/StaffGet.graphql'
import STAFF_UPDATE from '@/graphql/StaffUpdate.graphql'

export default {
  name: 'DialogStaffUpdate',
  apollo: {
    staff: {
      query: STAFF_GET,
      variables () {
        return {
          id: this.staffId
        }
      },
      skip () {
        return !this.staffId
      }
    }
  },
  components: {
    DialogYesNo
  },
  data: () => ({
    valid: false,
    // Staff from server
    staffId: '',
    staff: {},
    // Staff to be edited by form
    formStaffFactory: () => ({
      username: '',
      fullName: ''
    }),
    oriFormStaff: {},
    newFormStaff: {},
    rule: {
      username: [required, maxStrLength(16)],
      fullName: [required, maxStrLength(128)]
    },
    loading: false,
    dialogClose: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.oriFormStaff, this.newFormStaff)
    }
  },
  watch: {
    staff (val) {
      this.formStaffFactory = () => ({
        username: val.username,
        fullName: val.fullName
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

        const cache = cacheObjKeys(this, ['staffId', 'oriFormStaff', 'newFormStaff'])

        const optimisticResponse = {
          updateStaff: merge(cloneDeep(this.staff), diff)
        }

        this.close(true)

        try {
          await this.$apollo.mutate({
            mutation: STAFF_UPDATE,
            variables: {
              id: cache.staffId,
              ...diff
            },
            optimisticResponse
          })

          snackbarPush({ color: 'success', message: 'Staff updated' })
        } catch (e) {
          restoreObjKeys(this, cache)
          this.open(cache.staffId)

          snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
        }
      }
    }
  }
}
</script>

<style>
</style>
