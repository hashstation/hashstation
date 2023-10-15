<!--
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
-->

<template>
  <fc-tile title="PCFG info">
    <v-list
      single-line
      class="width100"
    >
      <v-list-item class="px-2 py-1">
        <v-list-item-action class="pr-3 key">
          Grammar:
        </v-list-item-action>
        <v-list-item-content class="text-right">
          <v-list-item-title>
            <router-link :to="{name: 'pcfg', params: { id: data.grammar_id }}">
              {{ data.grammar_name || `ID ${data.grammar_id}` }}
              <v-icon 
                small
                color="primary"
              >
                mdi-open-in-new
              </v-icon>
            </router-link>
          </v-list-item-title>
          <span>
            Keyspace: {{ fmt(data.grammar_keyspace) || 'not specified' }}
          </span>
        </v-list-item-content>
      </v-list-item>
      <v-data-table
        v-if="data.rules.length > 0"
        :headers="rule_table_headers"
        :items="data.rules"
        hide-default-footer
      >
        <template v-slot:item.rule.name="{ item: { rule } }">
          <router-link :to="{name: 'ruleDetail', params: { id: rule.id}}">
            {{ rule.name }}
            <v-icon 
              small
              color="primary"
            >
              mdi-open-in-new
            </v-icon>
          </router-link>
        </template>
        <template v-slot:item.rule.keyspace="{ item: { rule } }">
          {{ fmt(rule.count) }}
        </template>
      </v-data-table>
    </v-list>
  </fc-tile>
</template>

<script>
  import fmt from '@/assets/scripts/numberFormat'
  import tile from '@/components/tile/hs_tile.vue'
  export default {
    name: "PcfgDetail",
    components: {
      'fc-tile': tile
    },
    props: ['data'],
    data() {
      return {
        rule_table_headers: [
          {
            text: 'Rule name',
            align: 'start',
            value: 'rule.name'
          },
          {text: 'Count', value: 'rule.count', align: 'end'}
        ]
      }
    },
    methods: { fmt }
  }
</script>

<style scoped>

</style>
