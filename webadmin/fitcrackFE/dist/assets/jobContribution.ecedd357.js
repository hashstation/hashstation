import{D as r,m as i,c as d,g as l}from"./timeseries.9158092b.js";import{a as c}from"./jobWorkunits.ce8e4e1a.js";import{n as u}from"./index.3676fde9.js";var h={extends:r,mixins:[i.reactiveProp],props:{overrides:{type:Object,default:null}},computed:{options(){return d({maintainAspectRatio:!1,plugins:{tooltip:{mode:"index",intersect:!0}}},this.overrides)}},mounted(){this.renderChart(this.chartData,this.options)}},p=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container"},[t.loaded?a("doughnut",{staticClass:"chart chart-wrapper",attrs:{"chart-data":t.chartdata,overrides:t.options}}):t._e()],1)},_=[];const m={components:{Doughnut:h},mixins:[c],props:{id:{type:Number,default:void 0},batch:Boolean},data:()=>({loaded:!1,chartdata:null,options:{plugins:{legend:{display:!1}}}}),methods:{loadData(){const t=this.batch?"batch":"job";let e=`${this.$serverAddr}/chart/${t}Contribution/${this.id}`;this.axios.get(e).then(a=>{const o=a.data.labels.length,n=l(o,!0);this.chartdata={labels:a.data.labels,datasets:[{backgroundColor:n,data:a.data.data}]},this.loaded=!0})}}},s={};var v=u(m,p,_,!1,f,"6ffd9012",null,null);function f(t){for(let e in s)this[e]=s[e]}var C=function(){return v.exports}();export{C as c};
