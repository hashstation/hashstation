<!--
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
-->

<template>
  <div>
    <v-card-title>
      <span>Select PCFG grammar<span class="required primary--text"> *</span></span>
    </v-card-title>
    <pcfg-selector
      v-model="pcfg"
    />

    <v-divider />
    <v-card-title>
      <span>Edit keyspace limit</span>
    </v-card-title>
    <v-text-field
      v-model.number="keyspaceLimit"
      outlined
      single-line
      required
      type="number"
      suffix="passwords"
      :max="pcfg.length > 0 ? pcfg[0].keyspace : 0"
      @blur="checkValid"
    />
    <v-divider />
    <v-card-title>
      <span>Select rule file</span>
    </v-card-title>
    <rules-selector
      v-model="rules"
      select-all
      @input="checkValid"
    />

    <v-alert
      v-if="rules.length > 1"
      type="info"
    >
      <b>Order:</b> {{ rules.map(d => d.name).join(', ') }}
    </v-alert>

    <div
      v-if="rules.length > 1"
    >
      <v-card-title>
        <span>Rule application mode</span>
      </v-card-title>
      <v-radio-group
        v-model="ruleApplicationMode"
      >
        <v-radio
          label="Concatenated rules"
          :value="0"
        ></v-radio>
        <v-radio
          label="Dot product of rules"
          :value="1"
        ></v-radio>
      </v-radio-group>
      <v-divider />
    </div>

  </div>

</template>

<script>
  import pcfgSelector from '@/components/selector/pcfgSelector.vue'
  import ruleSelector from '@/components/selector/rulesSelector.vue'

  import {mapTwoWayState} from 'spyfu-vuex-helpers'
  import {twoWayMap} from '@/store'

  export default {
    name: "Pcfg",
    components: {
      'pcfg-selector': pcfgSelector,
      'rules-selector': ruleSelector
    },
    data: function () {
      return {
        attackId: 9,
        attackName: 'pcfg',
      }
    },
    watch: {
      pcfg (val) {
        if (val.length > 0) {
          this.keyspaceLimit = val[0].keyspace
        }
      }
    },
    computed: mapTwoWayState('jobForm', twoWayMap(['rules', 'pcfg', 'keyspaceLimit', 'ruleApplicationMode'])),
    methods: {
      checkValid: function () {
        if(this.pcfg.length > 0 && this.keyspaceLimit > this.pcfg[0].keyspace) {
          this.keyspaceLimit = this.pcfg[0].keyspace
        }
      }
    }
  }
</script>

<style scoped>
  .required {
    font-weight: bold;
  }
</style>
