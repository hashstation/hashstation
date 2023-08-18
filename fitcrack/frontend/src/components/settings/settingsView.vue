<!--
  * Author : see AUTHORS
  * Licence: MIT, see LICENSE
-->

<template>
  <v-container class="rmw mt-4">
    <v-row>
      <v-col>
        <v-card flat>

          <v-card-title>
            <v-icon left>
              mdi-palette
            </v-icon>
            <span>Appearance</span>
          </v-card-title>
          <v-card-text>
            <v-btn-toggle
              v-model="appearance"
              mandatory
              color="primary"
            >
              <v-btn value="auto">
                <v-icon
                  left
                  small
                  class="neutral ml-0"
                >
                  mdi-creation
                </v-icon>
                <span>Automatic</span>
              </v-btn>
              <v-btn value="light">
                <v-icon
                  left
                  small
                  class="neutral ml-0"
                >
                  mdi-brightness-5
                </v-icon>
                <span>Light</span>
              </v-btn>
              <v-btn value="dark">
                <v-icon
                  left
                  small
                  class="neutral ml-0"
                >
                  mdi-brightness-2
                </v-icon>
                <span>Dark</span>
              </v-btn>
            </v-btn-toggle>
            <div class="mt-2 ml-1">
              {{ appearanceHint }}.<span v-show="testmode"> Temporarily toggle with CTRL+SHIFT+L anywhere.</span>
            </div>
            </v-card-text>

            <v-card-title>
            <v-icon left>
              mdi-cursor-pointer
            </v-icon>
            <span>Behavior</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="mw">
                <v-switch
                    v-model="confirmpurge"
                    label="Job purge confirmation"
                    hint="Job purge requires clicking the button twice."
                    persistent-hint
                    class="mb-4 mt-0"
                />
                <v-switch
                  v-model="settings.verify_hash_format"
                  :loading="loading"
                  outlined
                  label="Verify hash format"
                  hint="Check if the format of every user-entered hash is valid."
                  persistent-hint
                  class="mb-4 mt-0"
                />
              </v-col>
              <v-col class="mw">
                <v-switch
                  v-model="settings.auto_add_hosts_to_running_jobs"
                  :loading="loading"
                  outlined
                  label="Add new hosts to running jobs"
                  hint="Automatically assign newly connected hosts to currently running jobs."
                  persistent-hint
                  class="mb-4 mt-0"
                />
                <v-switch
                  v-model="settings.bench_all"
                  :loading="loading"
                  outlined
                  label="Fully benchmark new hosts"
                  hint="Run a complete first-time benchmark on new hosts connected to the system."
                  persistent-hint
                  class="mb-4 mt-0"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-text-field
                v-model="settings.bench_runtime_limit"
                :loading="loading"
                outlined
                type="number"
                label="Benchmark runtime limit"
                hint="Maximum duration for the benchmark to run. A shorter duration may result in quicker but less precise speed results."
                persistent-hint
                suffix="seconds"
                class="mb-4"
              />
            </v-row>
           </v-card-text>
        </v-card>
        <v-expansion-panels flat class="mt-6">
          <v-expansion-panel>
            <v-expansion-panel-header class="px-4">
              <template v-slot:default="{ open }">
              <span class="d-flex align-center">
                <v-icon left>
                  mdi-puzzle
                </v-icon>
                <span class="text-h6">{{ open ? '' : 'Show '}}Advanced Settings</span>
              </span>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card-text>
            <v-text-field
              v-model="settings.default_seconds_per_workunit"
              :loading="loading"
              outlined
              type="number"
              label="Default time per workunit"
              :min="10"
              :hint="wuTimeHint"
              :color="settings.default_seconds_per_workunit < wutthresh ? 'warning' : ''"
              persistent-hint
              suffix="seconds"
              class="mb-4"
            />
            <v-text-field
              v-model="settings.workunit_timeout_factor"
              :loading="loading"
              outlined
              type="number"
              min="5"
              label="Workunit timeout factor"
              hint="Multiplying factor for workunit timeout — the time after which a workunit is considered failed."
              persistent-hint
              class="mb-4"
            />
            <v-text-field
              v-model="settings.hwmon_temp_abort"
              :loading="loading"
              outlined
              type="number"
              label="Temperature threshold"
              hint="Abort cracking if temperature of the client's PC reaches this threshold"
              persistent-hint
              suffix="°C"
              class="mb-4"
            />
            <v-switch
              v-model="testmode"
              label="Developer mode"
              hint="Enables useful utilities throughout the app when developing Fitcrack."
              persistent-hint
              class="mb-4"
            />
          </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    export default {
      name: "Settings",
      data: function() {
      return {
          appearance: localStorage.getItem('appearance') || 'auto',
          testmode: localStorage.getItem('testmode') == 'true' || false,
          settings: {},
          loading: true,
          saving: false,
          wutthresh: 180, // minimum reccomended seconds per WU
          confirmpurge: !localStorage.hasOwnProperty('confirmpurge') || localStorage.getItem('confirmpurge') == 'true'
        }
      },
      computed: {
        appearanceHint () {
          switch (this.appearance) {
            case 'auto':
              return 'Fitcrack will change appearance dynamically based on your system theme'
            case 'light':
              return 'Fitcrack will retain light appearance regardless of your system theme'
            case 'dark':
              return 'Fitcrack will retain dark appearance regardless of your system theme'
            default:
              return undefined
          }
        },
        wuTimeHint () {
          if (this.settings.default_seconds_per_workunit && this.settings.default_seconds_per_workunit < this.wutthresh) {
            return 'Setting extremely low time per workunit leads to high overhead. Cracking may take much longer than estimated. Consider choosing a higher default value.'
          } else {
            return 'The time per workunit preference used for new jobs. You can change it on a per-job basis in the additional settings step when creating a job or via the edit job dialog.'
          }
        }
      },
      watch: {
        appearance (value) {
          localStorage.setItem('appearance', value)
          if (value == 'dark') this.$vuetify.theme.dark = true
          if (value == 'light') this.$vuetify.theme.dark = false
          if (value == 'auto') this.$vuetify.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
        },
        testmode (value) {
          localStorage.setItem('testmode', value)
        },
        confirmpurge (value) {
          localStorage.setItem('confirmpurge', value)
        },
        settings: {
          deep: true,
          immediate: false,
          handler (val, old) {
            if (!this.loading && Object.keys(old).length > 0) {
              this.saveSettings()
            }
          }
        }
      },
      mounted () {
        this.loadSettings()
      },
      beforeRouteLeave (to, from, next) {
        if (!this.saving) next()
      },
      methods: {
        async loadSettings () {
          this.loading = true
          this.axios.get(this.$serverAddr + '/settings').then((response) => {
            this.settings = response.data
            this.loading = false
          })
        },
        saveSettings () {
          if (this.settings.workunit_timeout_factor < 5) { // see minTimeoutFactor in generator's Config.h
            this.$error('Workunit timeout factor cannot be smaller than 5.')
            return
          }
          this.saving = true
          this.axios.post(this.$serverAddr + '/settings', {
            ...this.settings
          })
          .then(() => {
            this.saving = false
            this.$store.state.jobForm.timeForJob = this.settings.default_seconds_per_workunit
          })
        }
      }
  }
</script>



<style scoped>
.neutral {
  color: unset !important
}

.mw {
  min-width: 300px;
}
.rmw {
  max-width: 900px;
}
</style>
