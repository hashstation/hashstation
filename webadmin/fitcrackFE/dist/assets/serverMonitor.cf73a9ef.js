import{R as o}from"./resourceMonitor.55e51c92.js";import{D as i}from"./datetime.befbef60.js";import{n as l}from"./index.f3e5e66e.js";import"./timeseries.9158092b.js";import"./vendor.6aa46313.js";var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"monitor-container"},[e("v-sheet",{staticClass:"monitor-sheet services-detail"},[e("v-card-title",[e("v-icon",{attrs:{left:""}},[t._v(" mdi-toolbox-outline ")]),t._v(" Services ")],1),e("div",{staticClass:"services-grid mx-4"},t._l(t.services,function(s){return e("div",{key:s.name,staticClass:"service mb-2"},[e("div",{staticClass:"status"},[e("v-sheet",{staticClass:"status-indicator",attrs:{color:t.statusColor(s.status)}}),e("span",{class:["status-text","overline",t.statusColor(s.status)+"--text"]},[t._v(t._s(s.status))])],1),t._v(" "+t._s(s.name)+" ")])}),0)],1),e("v-divider"),e("v-row",[e("v-col",{staticClass:"d-flex px-10 mt-2"},[e("v-switch",{staticClass:"mr-4",attrs:{label:"Custom range"},on:{input:t.loadData},model:{value:t.fullDate,callback:function(s){t.fullDate=s},expression:"fullDate"}}),t.fullDate?e("div",{staticClass:"d-flex"},[e("dt-picker",{staticClass:"mr-4",attrs:{label:"From"},on:{input:t.loadData},model:{value:t.chartsFrom,callback:function(s){t.chartsFrom=s},expression:"chartsFrom"}}),e("dt-picker",{attrs:{label:"To"},on:{input:t.loadData},model:{value:t.chartsTo,callback:function(s){t.chartsTo=s},expression:"chartsTo"}})],1):e("div",[e("v-radio-group",{staticClass:"dateSelect",attrs:{row:"","hide-details":""},on:{change:t.loadData},model:{value:t.hoursBefore,callback:function(s){t.hoursBefore=s},expression:"hoursBefore"}},[e("v-radio",{attrs:{value:"1",label:"last hour"}}),e("v-radio",{attrs:{value:"3",label:"last 3 hours"}}),e("v-radio",{attrs:{value:"6",label:"last 6 hours"}})],1)],1)],1)],1),e("v-progress-linear",{style:{opacity:t.loading?1:0},attrs:{indeterminate:""}}),e("v-divider"),e("div",{staticClass:"monitor-charts"},[e("v-sheet",{staticClass:"monitor-sheet chart"},[e("v-card-title",[e("v-icon",{attrs:{left:""}},[t._v(" mdi-memory ")]),t._v(" CPU ")],1),e("res-mon",{attrs:{"usage-data":t.usageData,metrics:["cpu"],max:100}})],1),e("v-sheet",{staticClass:"monitor-sheet chart"},[e("v-card-title",[e("v-icon",{attrs:{left:""}},[t._v(" mdi-chip ")]),t._v(" Memory ")],1),e("res-mon",{attrs:{"usage-data":t.usageData,metrics:["ram"],max:100}})],1),e("v-sheet",{staticClass:"monitor-sheet chart"},[e("v-card-title",[e("v-icon",{attrs:{left:""}},[t._v(" mdi-harddisk ")]),t._v(" Disk ")],1),e("res-mon",{attrs:{"usage-data":t.usageData,metrics:["hdd_read","hdd_write"]}})],1),e("v-sheet",{staticClass:"monitor-sheet chart"},[e("v-card-title",[e("v-icon",{attrs:{left:""}},[t._v(" mdi-ethernet ")]),t._v(" Network ")],1),e("res-mon",{attrs:{"usage-data":t.usageData,metrics:["net_recv","net_sent"]}})],1)],1)],1)},c=[];const m={components:{ResMon:o,DtPicker:i},data(){return{infoInterval:null,dataInterval:null,fullDate:!1,hoursBefore:"3",chartsFrom:this.$moment().subtract(1,"hours").format("YYYY-MM-DDTHH:mm"),chartsTo:this.$moment().format("YYYY-MM-DDTHH:mm"),services:[],usageData:[]}},mounted(){this.loadInfo(),this.infoInterval=setInterval(this.loadInfo,6e4),this.loadData(!0),this.dataInterval=setInterval(this.loadData,15e3)},beforeDestroy(){clearInterval(this.infoInterval),clearInterval(this.dataInterval)},methods:{async loadInfo(){this.services=await this.axios.get(`${this.$serverAddr}/serverInfo/info`).then(t=>t.data.subsystems)},async loadData(t=!1){t&&(this.loading=!0);let a,e="";if(this.fullDate){if(this.chartsFrom.length===16)a=this.$moment(this.chartsFrom,"YYYY-MM-DDTHH:mm").utc().format("YYYY-M-D H:mm:ss");else return;if(this.chartsTo.length===16)e=this.$moment(this.chartsTo,"YYYY-MM-DDTHH:mm").utc().format("YYYY-M-D H:mm:ss");else return}else a=this.$moment().subtract(this.hoursBefore,"hours").utc().format("YYYY-M-D H:mm:ss");this.usageData=await this.axios.get(`${this.$serverAddr}/serverInfo/getUsageData`,{params:{from_date:a,to_date:e}}).then(s=>s.data.items),this.loading=!1},statusColor(t){switch(t){case"running":return"success";default:return"error"}}}},r={};var v=l(m,n,c,!1,d,"09ff5da8",null,null);function d(t){for(let a in r)this[a]=r[a]}var p=function(){return v.exports}();export{p as default};
