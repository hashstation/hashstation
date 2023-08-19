<!--
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
-->

<template>
  <div>
    <v-card-title>
      <span>Select dictionary<span class="required primary--text"> *</span></span>
    </v-card-title>
    <dict-selector
      v-model="leftDicts"
      select-all
      @input="checkValid"
    />

    <v-alert
      v-if="leftDicts.length > 0"
      type="info"
    >
      <b>Order:</b> {{ leftDicts.map(d => d.name).join(', ') }}
    </v-alert>

    <v-divider />
    <v-card-title>
      <span>Fragmentation of dictionaries</span>
    </v-card-title>
    <v-radio-group
      v-model="distributionMode"
    >
      <v-radio
        label="On server"
        :value="0"
      ></v-radio>
      <v-radio
        label="On hosts"
        :value="1"
      ></v-radio>
    </v-radio-group>
    <v-divider />

    <div
      v-if="distributionMode == 1"
    >
      <v-card-title>
        <span>Deployment of dictionaries</span>
      </v-card-title>
      <v-radio-group
        v-model="dictDeploymentMode"
      >
        <v-radio
          label="Automatically send dictionaries to hosts"
          :value="0"
        ></v-radio>
        <v-radio
          label="Use local (prestored) dictionaries on hosts"
          :value="1"
        ></v-radio>
      </v-radio-group>
      <v-divider />
    </div>

    <v-card-title>
      <span>Select rule file</span>
    </v-card-title>
    <rules-selector
      v-model="rules"
      select-all
      @input="checkValid"
    />

    <v-alert
      v-if="rules.length > 0"
      type="info"
    >
      <b>Order:</b> {{ rules.map(d => d.name).join(', ') }}
    </v-alert>

    <v-divider />
    <v-checkbox
      v-model="slowCandidates"
      label="Enable slow candidates mode"
    />
  </div>
</template>

<script>
  import dictSelector from '@/components/selector/dictionarySelector.vue'
  import ruleSelector from '@/components/selector/rulesSelector.vue'

  import {mapTwoWayState} from 'spyfu-vuex-helpers'
  import {twoWayMap} from '@/store'

  export default {
    name: "Dictionary",
    components: {
      'dict-selector': dictSelector,
      'rules-selector': ruleSelector
    },
    computed: mapTwoWayState('jobForm', twoWayMap(['leftDicts', 'rules', 'distributionMode', 'dictDeploymentMode', 'slowCandidates'])),
    methods: {
      checkValid: function () {
        if (this.leftDicts.length > 0) {
          return true
        }
        return false
      }
    }
  }
</script>

<style scoped>
  .required {
    font-weight: bold;
    color: #000;
  }
</style>
