import{D as r,m as i,c as d,g as l}from"./timeseries.08527a7f.js";import{a as c}from"./jobWorkunits.a1fa327b.js";import{n as u}from"./index.0b777807.js";var h={extends:r,mixins:[i.reactiveProp],props:{overrides:{type:Object,default:null}},computed:{options(){return d({maintainAspectRatio:!1,plugins:{tooltip:{mode:"index",intersect:!0}}},this.overrides)}},mounted(){this.renderChart(this.chartData,this.options)}},p=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"container"},[t.loaded?e("doughnut",{staticClass:"chart chart-wrapper",attrs:{"chart-data":t.chartdata,overrides:t.options}}):t._e()],1)},_=[];const m={components:{Doughnut:h},mixins:[c],props:{id:{type:Number,default:void 0},batch:Boolean},data:()=>({loaded:!1,chartdata:null,options:{plugins:{legend:{display:!1}}}}),methods:{loadData(){const t=this.batch?"batch":"job";let a=`${this.$serverAddr}/chart/${t}Contribution/${this.id}`;this.axios.get(a).then(e=>{const o=e.data.labels.length,n=l(o,!0);this.chartdata={labels:e.data.labels,datasets:[{backgroundColor:n,data:e.data.data}]},this.loaded=!0})}}},s={};var v=u(m,p,_,!1,f,"6ffd9012",null,null);function f(t){for(let a in s)this[a]=s[a]}var C=function(){return v.exports}();export{C as c};