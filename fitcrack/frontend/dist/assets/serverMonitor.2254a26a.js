import{R as o}from"./resourceMonitor.5c01dbd0.js";import{D as i}from"./datetime.23beec06.js";import{n as l}from"./index.c4459d03.js";import"./timeseries.9158092b.js";import"./vendor.6aa46313.js";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"monitor-container"},[s("v-sheet",{staticClass:"monitor-sheet services-detail"},[s("v-card-title",[s("v-icon",{attrs:{left:""}},[t._v(" mdi-toolbox-outline ")]),t._v(" Services ")],1),s("div",{staticClass:"services-grid mx-4"},t._l(t.services,function(a){return s("div",{key:a.name,staticClass:"service mb-2"},[s("div",{staticClass:"status"},[s("v-sheet",{staticClass:"status-indicator",attrs:{color:t.statusColor(a.status)}}),s("span",{class:["status-text","overline",t.statusColor(a.status)+"--text"]},[t._v(t._s(a.status))])],1),t._v(" "+t._s(a.name)+" ")])}),0)],1),s("v-divider"),s("v-row",[s("v-col",{staticClass:"d-flex px-10 mt-2"},[s("v-switch",{staticClass:"mr-4",attrs:{label:"Custom range"},on:{input:t.loadData},model:{value:t.fullDate,callback:function(a){t.fullDate=a},expression:"fullDate"}}),t.fullDate?s("div",{staticClass:"d-flex"},[s("dt-picker",{staticClass:"mr-4",attrs:{label:"From"},on:{input:t.loadData},model:{value:t.chartsFrom,callback:function(a){t.chartsFrom=a},expression:"chartsFrom"}}),s("dt-picker",{attrs:{label:"To"},on:{input:t.loadData},model:{value:t.chartsTo,callback:function(a){t.chartsTo=a},expression:"chartsTo"}})],1):s("div",[s("v-radio-group",{staticClass:"dateSelect",attrs:{row:"","hide-details":""},on:{change:t.loadData},model:{value:t.hoursBefore,callback:function(a){t.hoursBefore=a},expression:"hoursBefore"}},[s("v-radio",{attrs:{value:"1",label:"last hour"}}),s("v-radio",{attrs:{value:"3",label:"last 3 hours"}}),s("v-radio",{attrs:{value:"6",label:"last 6 hours"}})],1)],1)],1)],1),s("v-progress-linear",{style:{opacity:t.loading?1:0},attrs:{indeterminate:""}}),s("v-divider"),s("div",{staticClass:"monitor-charts"},[s("v-sheet",{staticClass:"monitor-sheet chart"},[s("v-card-title",[s("v-icon",{attrs:{left:""}},[t._v(" mdi-memory ")]),t._v(" CPU ")],1),s("res-mon",{attrs:{"usage-data":t.usageData,metrics:["cpu"],max:100}})],1),s("v-sheet",{staticClass:"monitor-sheet chart"},[s("v-card-title",[s("v-icon",{attrs:{left:""}},[t._v(" mdi-chip ")]),t._v(" Memory ")],1),s("res-mon",{attrs:{"usage-data":t.usageData,metrics:["ram"],max:100}})],1),s("v-sheet",{staticClass:"monitor-sheet chart"},[s("v-card-title",[s("v-icon",{attrs:{left:""}},[t._v(" mdi-harddisk ")]),t._v(" Disk ")],1),s("res-mon",{attrs:{"usage-data":t.usageData,metrics:["hdd_read","hdd_write"]}})],1),s("v-sheet",{staticClass:"monitor-sheet chart"},[s("v-card-title",[s("v-icon",{attrs:{left:""}},[t._v(" mdi-ethernet ")]),t._v(" Network ")],1),s("res-mon",{attrs:{"usage-data":t.usageData,metrics:["net_recv","net_sent"]}})],1)],1)],1)},c=[];const m={components:{ResMon:o,DtPicker:i},data(){return{infoInterval:null,dataInterval:null,fullDate:!1,hoursBefore:"3",chartsFrom:this.$moment().subtract(1,"hours").format("YYYY-MM-DDTHH:mm"),chartsTo:this.$moment().format("YYYY-MM-DDTHH:mm"),services:[],usageData:[]}},mounted(){this.loadInfo(),this.infoInterval=setInterval(this.loadInfo,6e4),this.loadData(!0),this.dataInterval=setInterval(this.loadData,15e3)},beforeDestroy(){clearInterval(this.infoInterval),clearInterval(this.dataInterval)},methods:{async loadInfo(){this.services=await this.axios.get(`${this.$serverAddr}/serverInfo/info`).then(t=>t.data.subsystems)},async loadData(t=!1){t&&(this.loading=!0);let e,s="";if(this.fullDate){if(this.chartsFrom.length===16)e=this.$moment(this.chartsFrom,"YYYY-MM-DDTHH:mm").utc().format("YYYY-M-D H:mm:ss");else return;if(this.chartsTo.length===16)s=this.$moment(this.chartsTo,"YYYY-MM-DDTHH:mm").utc().format("YYYY-M-D H:mm:ss");else return}else e=this.$moment().subtract(this.hoursBefore,"hours").utc().format("YYYY-M-D H:mm:ss");this.usageData=await this.axios.get(`${this.$serverAddr}/serverInfo/getUsageData`,{params:{from_date:e,to_date:s}}).then(a=>a.data.items),this.loading=!1},statusColor(t){switch(t){case"running":return"success";default:return"error"}}}},r={};var v=l(m,n,c,!1,d,"09ff5da8",null,null);function d(t){for(let e in r)this[e]=r[e]}var p=function(){return v.exports}();export{p as default};
