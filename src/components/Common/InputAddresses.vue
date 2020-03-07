<template>
  <v-input
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template
      v-for="(_, slot) in $scopedSlots"
      #[slot]="scope"
    >
      <slot
        v-bind="scope"
        :name="slot"
      />
    </template>
    <v-row no-gutters>
      <v-col
        v-for="(address, i) in addresses"
        :key="i"
        cols="12"
      >
        <v-text-field
          :value="address"
          :append-outer-icon="readonly ? '' : 'mdi-close'"
          color="primary"
          placeholder="Address"
          hide-details
          dense
          solo
          flat
          @click:append-outer="addresses.splice(i, 1)"
          @input="addresses[i] = $event"
        />
      </v-col>
      <v-col
        v-show="!readonly"
        key="footer"
        cols="12"
      >
        <v-btn
          small
          right
          color="primary"
          @click.stop="addEmptyAddress()"
        >
          <v-icon
            left
            small
          >
            mdi-plus
          </v-icon>
          Add
        </v-btn>
      </v-col>
    </v-row>
  </v-input>
</template>

<script>
export default {
  name: 'InputAddresses',
  props: {
    addresses: {
      type: Array,
      default: () => []
    },
    minOneAddress: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    addresses: {
      handler (val) {
        if (this.minOneAddress && this.addresses.length <= 0) {
          this.addEmptyAddress()
        }
      },
      immediate: true
    }
  },
  methods: {
    addEmptyAddress () {
      this.addresses.push('')
    }
  }
}
</script>
