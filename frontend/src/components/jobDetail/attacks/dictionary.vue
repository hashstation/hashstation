<!--
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
-->

<template>
  <fc-tile title="Dictionaries and rules">
    <v-data-table
      :headers="dictionary_table_headers"
      :items="data.left_dictionaries"
      hide-default-footer
    >
      <template v-slot:item.dictionary.name="{ item: { dictionary } }">
        <router-link :to="{name: 'dictionaryDetail', params: { id: dictionary.id}}">
          {{ dictionary.name }}
          <v-icon 
            small
            color="primary"
          >
            mdi-open-in-new
          </v-icon>
        </router-link>
      </template>
      <template v-slot:item.dictionary.keyspace="{ item: { dictionary } }">
        {{ fmt(dictionary.keyspace) }}
      </template>
      <template v-slot:item.progress="{ item: { current_index, dictionary: { keyspace } } }">
        <v-progress-circular
          size="16"
          :width="3"
          :rotate="270"
          color="primary"
          :value="(100 / keyspace) * current_index"
        />
        <span>{{ ((100 / keyspace) * current_index).toFixed() }} %</span>
      </template>
    </v-data-table>
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
  </fc-tile>
</template>

<script>
  import fmt from '@/assets/scripts/numberFormat'
  import tile from '@/components/tile/hs_tile.vue'
  export default {
    name: "DictionaryDetail",
    components: {
      'fc-tile': tile
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        dictionary_table_headers: [
          {
            text: 'Dictionary name',
            align: 'start',
            value: 'dictionary.name'
          },
          {text: 'Keyspace', value: 'dictionary.keyspace', align: 'end'},
          {text: 'Progress', value: 'progress', align: 'end'}
        ],
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
