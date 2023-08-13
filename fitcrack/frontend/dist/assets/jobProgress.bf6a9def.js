import{T as r,l as i,p as o}from"./timeseries.9158092b.js";import{a as n,b as d}from"./jobWorkunits.add6801e.js";import{n as l}from"./index.358b521f.js";var m=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"container"},[s("v-progress-linear",{directives:[{name:"show",rawName:"v-show",value:e.loading,expression:"loading"}],attrs:{indeterminate:"",absolute:""}}),e.loaded?s("timeseries",{staticClass:"chart-wrapper",attrs:{"chart-data":e.chartdata,overrides:e.options}}):e._e()],1)},u=[];const c={components:{Timeseries:r},mixins:[n,d],props:{id:{type:Number,default:void 0},from:{type:String,default:void 0},to:{type:String,default:void 0}},data:()=>({loaded:!1,loading:!1,chartdata:null,options:{elements:{line:{fill:!0}},plugins:{legend:{display:!1}},scales:{x:{gridLines:{display:!1}},y:{ticks:{callback(e){return`${e} %`}},min:0,max:100}}}}),computed:{fromTime(){return!this.id&&!this.from?this.$moment.utc().subtract(24,"hours").format("YYYY-M-DTH:mm:ss"):this.$moment(this.from).utc().format("YYYY-M-DTH:mm:ss")},toTime(){return this.to?this.$moment(this.to).utc().format("YYYY-M-DTH:mm:ss"):void 0}},methods:{loadData(e=!1){e&&(this.loading=!0);let t=`${this.$serverAddr}/chart/jobProgress`;this.id&&(t+=`/${this.id}`),this.axios.get(t,{params:{from:this.fromTime,to:this.toTime}}).then(s=>{this.chartdata={datasets:i(o(s.data.datasets))},this.loading=!1,this.loaded=!0})}}},a={};var f=l(c,m,u,!1,h,"0bdc09b1",null,null);function h(e){for(let t in a)this[t]=a[t]}var g=function(){return f.exports}();export{g as j};
