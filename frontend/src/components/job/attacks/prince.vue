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
      v-if="leftDicts.length > 1"
      type="info"
    >
      <b>Order:</b> {{ leftDicts.map(d => d.name).join(', ') }}
    </v-alert>

    <v-divider />
    <v-checkbox
       v-model="checkDuplicates"
       label="Check for password duplicates"
    />
    <v-divider />
    <v-checkbox
       v-model="casePermute"
       label="Case permutation"
    />

    <v-divider />
    <v-card-title>
      <span>Minimal length of passwords (1 - 32)</span>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model.number="minPasswordLen"
        text
        single-line
        :value="minPasswordLen"
        required
        type="number"
        min="1"
        max="32"
        @input="checkValid"
      />
    </v-card-text>

    <v-divider />
    <v-card-title>
      <span>Maximal length of passwords (1 - 32)</span>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model.number="maxPasswordLen"
        text
        single-line
        :value="maxPasswordLen"
        required
        type="number"
        min="1"
        max="32"
        @input="checkValid"
      />
    </v-card-text>

    <v-divider />
    <v-card-title>
      <span>Minimal number of elements per chain (1 - 16)</span>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model.number="minElemInChain"
        text
        single-line
        :value="minElemInChain"
        required
        type="number"
        min="1"
        max="16"
        @input="checkValid"
      />
    </v-card-text>

    <v-divider />
    <v-card-title>
      <span>Maximal number of elements per chain (1 - 16)</span>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model.number="maxElemInChain"
        text
        single-line
        :value="maxElemInChain"
        required
        type="number"
        min="1"
        max="16"
        @input="checkValid"
      />
    </v-card-text>

    <v-card-title>
      <span>Edit keyspace limit</span>
    </v-card-title>
    <v-text-field
      v-model.number="keyspaceLimit"
      text
      single-line
      :value="keyspaceLimit"
      required
      type="number"
      suffix="passwords"
      min="0"
      max="keyspace"
      @input="checkValid"
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
  import dictSelector from '@/components/selector/dictionarySelector.vue'
  import ruleSelector from '@/components/selector/rulesSelector.vue'

  import {mapTwoWayState} from 'spyfu-vuex-helpers'
  import {twoWayMap} from '@/store'

  export default {
    name: "Prince",
    components: {
      'dict-selector': dictSelector,
      'rules-selector': ruleSelector
    },
    props: ['keyspace'],
    watch: {
      keyspace (val) {
        if (val)
          this.keyspaceLimit = val
      }
    },
    computed: mapTwoWayState('jobForm', twoWayMap(['leftDicts', 'rules', 'checkDuplicates',
    'casePermute', 'minPasswordLen', 'maxPasswordLen', 'minElemInChain', 'maxElemInChain', 
    'keyspaceLimit', 'ruleApplicationMode'])),
    methods: {
      checkValid: function () {
        if (this.minPasswordLen <= 0) {
            this.$error('Minimal length of passwords must be greater than 0.')
            return false;
        }
        if (this.maxPasswordLen <= 0) {
            this.$error('Maximal length of passwords must be greater than 0.')
            return false;
        }
        if (this.maxPasswordLen > 32) {
            this.$error('Maximal length of passwords must be smaller or equal to 32.')
            return false;
        }
        if (this.minElemInChain <= 0) {
            this.$error('Minimal number of elements per chain must be greater than 0.')
            return false;
        }
        if (this.maxElemInChain <= 0) {
            this.$error('Maximal number of elements per chain must be greater than 0.')
            return false;
        }
        if (this.maxElemInChain > 16) {
            this.$error('Maximal number of elements per chain must be to 16.')
            return false;
        }
        if (this.minPasswordLen > this.maxPasswordLen) {
            this.$error('Minimal length of passwords must be greater than maximal length of passwords.')
            return false;
        }
        if (this.minElemInChain > this.maxElemInChain) {
            this.$error('Minimal number of elements per chain must be smaller or equal than maximal number of elements per chain.')
            return false;
        }
        if (this.maxElemInChain > this.maxPasswordLen) {
            this.$error('Maximal number of elements per chain must be smaller or equal than maximal length of passwords.')
            return false;
        }
        if (this.keyspaceLimit < 0) {
            this.$error('Keyspace limit must be nonnegative value.')
            return false;
        }

        // Hide any previous error alert, new settings are valid
        this.$hideAlert()
        return true
      }
    }
  }
</script>

<style scoped>
  .border {
    border-right: 2px solid rgba(0,0,0,.12)
  }

  .required {
    font-weight: bold;
    color: #000;
  }
</style>

