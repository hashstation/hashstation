
<template>
  <div class="dash-container">
    <v-sheet class="dash-row pa-0">
      <status
        v-if="hostsInfo"
        :jobs="jobsInfo"
        :hosts="hostsInfo"
        :server="serverInfo"
      >
        <server-gauges
          v-bind="actualUsage"
          :services="serverInfo"
        />
      </status>
    </v-sheet>
    <v-divider />
    <v-card-title class="px-8">
      Last jobs
    </v-card-title>
    <div
      v-if="lastJobs"
      class="minijobs overflowing dash-row pt-0 pb-7 px-8"
    >
      <minijob
        detailed
        :data="lastJobs[0]"
      />
      <minijob
        v-for="j in lastJobs.slice(1)"
        :key="j.id"
        :data="j"
      />
    </div>
  </div>
</template>

<script>
  import status from '@/components/dashboard/status.vue'
  import minijob from '@/components/dashboard/miniJob.vue'
  import serverGauges from '@/components/dashboard/serverGauges.vue'
  
  import jobProgress from '@/components/chart/jobProgress.vue'
  import jobWorkunits from '@/components/chart/jobWorkunits.vue'

  import { attackIcon } from '@/assets/scripts/iconMaps'
  import dtPicker from '@/components/picker/datetime.vue'

  export default {
    name: 'Dashboard',
    components: {
      status,
      minijob,
      serverGauges,
      jobProgress,
      jobWorkunits,
      dtPicker
    },
    data () {
      return {
        hostsInfo: null,
        jobsInfo: [],
        serverInfo: [],
        lastJobs: null,
        actualUsage: {
          cpu: 0,
          ram: 0,
          hdd_read: 0,
          hdd_write: 0,
          net_recv: 0,
          net_sent: 0
        }
      }
    },
    mounted () {
      this.loadData()
      this.interval = setInterval(this.loadData, 5000)
    },
    beforeDestroy () {
      clearInterval(this.interval)
    },
    methods: {
      loadData () {
        this.axios.get(this.$serverAddr + '/job/lastJobs').then((response) => {
          this.lastJobs = response.data.items;
        })

        this.axios.get(this.$serverAddr + '/serverInfo/actualUsageData').then((response) => {
          this.actualUsage = response.data
        })

        this.axios.get(this.$serverAddr + '/hosts/info').then((response) => {
          this.hostsInfo = response.data
        })
        this.axios.get(this.$serverAddr + '/job/info').then((response) => {
          this.jobsInfo = response.data
        })
        this.axios.get(this.$serverAddr + '/serverInfo/info').then((response) => {
          this.serverInfo = response.data.subsystems
        })
      }
    }
  }
</script>

<style scoped>
.dash-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.overflowing {
  flex-wrap: nowrap;
  overflow-x: auto;
}
.minijobs {
  align-items: stretch;
}

.half {
  width: 50%;
}
@media screen and (max-width: 600px) {
  .half {
    width: 100%;
  }
}
</style>