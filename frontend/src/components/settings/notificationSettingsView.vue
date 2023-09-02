<!--
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
-->

<template>
  <div class="cont">
    <v-row class="align-center">
      <v-col>
        <v-btn
            @click="createNewNotificationSetting=true"
            text
            class="mr-2"
            >
            <v-icon left>
                mdi-plus
            </v-icon>
            Add
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      ref="table"
      :headers="headers"
      :items="notificationServices"
      :options.sync="pagination"
      :server-items-length="totalItems"
      :loading="loading"
      :footer-props="{itemsPerPageOptions: [25,50,100], itemsPerPageText: 'Services per page'}"
      fixed-header
    >
      <template v-slot:item.service_name="{ item }">
        {{ item.service_name }}
      </template>

      <template v-slot:item.enabled="{ item }">
        {{ item.enabled ? 'Yes' : 'No' }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import iconv from 'iconv-lite'
  export default {
    name: "NotificationServicesView",
    data: function () {
      return {
        interval: null,
        totalItems: 0,
        pagination: {},
        loading: true,
        createNewNotificationSetting: false,
        headers: [
          {
            text: 'Name',
            align: 'start',
            value: 'service_name'
          },
          {text: 'Enabled', value: 'enabled', align: 'center', sortable: false},
        ],
        notificationServices: []
      }
    },
    watch: {
      pagination: {
        handler: 'updateList',
        deep: true
      },
      '$route.name': 'updateList',
    },
    mounted() {
      this.interval = setInterval(function () {
        this.loadNotificationServices()
      }.bind(this), 5000)
    },
    beforeDestroy: function () {
      clearInterval(this.interval)
    },
    methods: {
      loadNotificationServices() {
        this.axios.get(this.$serverAddr + '/notificationServices', {
          params: {
            'page': this.pagination.page,
            'per_page': this.pagination.itemsPerPage,
          }
        }).then((response) => {
          this.notificationServices = response.data.items;
          this.totalItems = response.data.total;
          this.loading = false
        })
      },
      updateList () {
        this.loading = true
        this.loadNotificationServices()
      },
    }
  }
</script>

<style scoped>

  .middle {
    vertical-align: middle;
  }

  .cont {
    height: 100%;

  }

  .oneline {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    width: 200px;
    line-height: 50px;
    height: 50px;
  }

  .inheritColor {
    color: inherit !important;
  }

</style>
