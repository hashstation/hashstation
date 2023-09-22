<!--
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
-->

<template>
  <div class="cont">
    <v-row class="align-center">
      <v-col>
        <v-card-title class="py-2">
          <v-text-field
            v-model="search"
            clearable
            flat
            outlined
            prepend-inner-icon="mdi-database-search"
            label="Search by password or hash"
            single-line
            hide-details
          />
        </v-card-title>
      </v-col>
      <v-col>
        <v-btn
        v-if="selectedHashes.length > 0"
        @click="multiDelete"
        text
        class="mr-2"
        >
          <v-icon left>
            mdi-delete
          </v-icon>
          Delete
        </v-btn>
        <v-btn
        @click="uploadCrackedHashesDialog=true"
        text
        class="mr-2"
        >
          <v-icon left>
            mdi-import
          </v-icon>
          Import cracked hashes
        </v-btn>
        <v-btn
        @click="exportAllCrackedHashes"
        text
        class="mr-2"
        >
          <v-icon left>
            mdi-export
          </v-icon>
          Export all cracked hashes
        </v-btn>
      </v-col>
    </v-row>
    <v-divider />
    <v-data-table
      ref="table"
      v-model="selectedHashes"
      :headers="headers"
      :items="hashes"
      :search="search"
      :options.sync="pagination"
      :server-items-length="totalItems"
      :loading="loading"
      :footer-props="{
        itemsPerPageOptions: [15, 30, 50, {
          value: totalItems,
          text: 'All'
        }],
        itemsPerPageText: 'Hashes per page'
      }"
      :items-per-page="15"
      show-select
      fixed-header
    >
      <template v-slot:item.password="{ item }">
        {{ item.password || '–' }}
      </template>
      <template v-slot:item.hash="{ item }">
        <div class="d-flex align-center mw-50">
          <v-dialog max-width="600">
            <template v-slot:activator="{ on }">
              <span 
                class="text-truncate d-inline-block"
                v-on="on"
              >
                {{ item.hash }}
              </span>
            </template>
            <v-card>
              <v-card-title primary-title>
                {{ item.hash_type_name }}
              </v-card-title>
              <v-card-text>
                {{ item.hash }}
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- <svg 
            xmlns="http://www.w3.org/2000/svg"
            height="18"
            width="100%"
          >
            <rect
              v-for="(char, i) in item.hash"
              :key="i"
              :x="i"
              :y="18 + 5 - char.charCodeAt(0) / 5"
              width="1"
              :height="char.charCodeAt(0) / 5 - 5"
              :fill="'hsla(' + (char.charCodeAt(0) * 5 - 100) + ',100%,50%,50%)'"
            />
          </svg> -->
        </div>
      </template>
      <template v-slot:item.added="{ item }">
        {{ $moment.utc(item.added).local().format('D.M.YYYY H:mm:ss') }}
      </template>
      <template v-slot:item.job="{ item }">
        <div v-if="item.job">
          <router-link
            :to="{ name: 'jobDetail', params: { id: item.job.id } }"
            class="middle"
          >
            {{ item.job.name }}
          </router-link>
        </div>
      </template>
    </v-data-table>

    <v-dialog
      v-model="uploadCrackedHashesDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <h2>Upload cracked hashes</h2>
        </v-card-title>
        
        <v-alert
          tile
          text
          type="warning"
          class="mb-0"
        >
          Imported files must have a .csv extension.
          Expected CSV header: Hash,Hash type,Password
        </v-alert>

        <v-card-text>
          <file-uploader
            :url="this.$serverAddr + '/hashes/importCrackedHashes'"
            @uploadComplete="uploadCrackedHashesDialog = false;loadHashes()"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click.stop="uploadCrackedHashesDialog=false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import tile from '@/components/tile/fc_tile.vue'
  import FileUploader from "@/components/fileUploader/fileUploader.vue";

  export default {
    name: "HashesView",
    components: {
      FileUploader,
      'fc-tile': tile,
    },
    data: function () {
      return {
        interval: null,
        status: 'active',
        search: '',
        totalItems: 0,
        pagination: {},
        loading: true,
        uploadCrackedHashesDialog: false,
        selectedHashes: [],
        headers: [
          {text: 'Username', value: 'username', align: 'start', sortable: true},
          {text: 'Hash type', value: 'hash_type_name', align: 'start', sortable: true},
          {text: 'Hash', value: 'hash', align: 'start', sortable: true},
          {text: 'Password', value: 'password', align: 'start', sortable: true},
          {text: 'Job', value: 'job', align: 'end', sortable: true}
        ],
        hashes:
          []
      }
    },
    watch: {
      pagination: {
        handler() {
          this.loading = true;
          this.loadHashes()
        },
        deep: true
      }
    },
    mounted() {
      this.interval = setInterval(function () {
        this.loadHashes()
      }.bind(this), 5000)
    },
    beforeDestroy: function () {
      clearInterval(this.interval)
    },
    methods: {
      loadHashes() {
        this.axios.get(this.$serverAddr + '/hashes', {
          params: {
            'page': this.pagination.page,
            'per_page': this.pagination.itemsPerPage,
            'order_by': this.pagination.sortBy[0],
            'descending': this.pagination.sortDesc[0],
            'search': this.search
          }
        }).then((response) => {
          this.hashes = response.data.items;
          this.totalItems = response.data.total;
          this.loading = false
        })
      },
      updateStatus: function (e) {
        this.status = e;
        this.$refs.table.updatePagination({page: 1, totalItems: this.totalItems})
      },
      exportAllCrackedHashes () {
          this.axios.get(this.$serverAddr + '/hashes/exportCrackedHashes').then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', "cracked_hashes.csv"); 
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
        });
    },
    multiDelete () {
        if (this.selectedHashes.length == 0) return
        //
        this.loading = true
        this.axios.patch(this.$serverAddr + '/hashes', {
          hash_ids: this.selectedHashes.map(h => h.id)
        })
        .then((response) => {
          this.loadHashes()
        })
      },
    }
  }
</script>

<style scoped>

  .mw-50 {
    max-width: 50vw;
  }

  .cont {
    height: 100%;

  }

</style>
