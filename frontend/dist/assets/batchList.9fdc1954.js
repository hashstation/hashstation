import{n as c}from"./index.af50fcae.js";import"./vendor.6aa46313.js";var l=function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("div",[a("v-data-table",{ref:"table",attrs:{loading:t.loading,headers:t.headers,items:t.batches,options:t.pagination,"server-items-length":t.totalItems,"footer-props":{itemsPerPageOptions:[25,10,50,100],itemsPerPageText:"Batches per page"},"fixed-header":"","disable-sort":""},on:{"update:options":function(s){t.pagination=s}},scopedSlots:t._u([{key:"item.name",fn:function(s){var e=s.item;return[a("router-link",{staticClass:"table-link",attrs:{to:"/batches/"+e.id}},[t._v(" "+t._s(e.name)+" ")])]}},{key:"item.status",fn:function(s){var e=s.item;return[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(i){var o=i.on;return[a("span",t._g({class:[e.status.color+"--text","text-capitalize"]},o),[t._v(" "+t._s(e.status.text)+" "),a("v-icon",{attrs:{right:"",color:e.status.color}},[t._v(" "+t._s(e.status.icon)+" ")])],1)]}}],null,!0)},[a("span",[t._v(t._s(e.status.description))])])]}},{key:"item.total_jobs",fn:function(s){var e=s.item;return[a("span",[a("strong",[t._v(t._s(e.total_jobs))]),t._v(" jobs")])]}},{key:"item.waiting_jobs",fn:function(s){var e=s.item;return[a("v-progress-circular",{attrs:{size:"18",width:3,rotate:270,value:100/e.total_jobs*(e.total_jobs-e.waiting_jobs)}}),a("span",{staticClass:"ml-2"},[a("strong",[t._v(t._s(e.waiting_jobs))]),t._v(" in queue")])]}},{key:"item.actions",fn:function(s){var e=s.item;return[a("div",{staticClass:"actionsBtns"},[e.current_user_can_operate?[e.status.code<10?a("v-btn",{attrs:{disabled:e.status.code==1,text:"",color:"success"},on:{click:function(i){return t.runBatch(e.id)}}},[t._v(" Run "),a("v-icon",{attrs:{right:""}},[t._v(" mdi-play ")])],1):e.status.code<20?a("v-btn",{attrs:{text:"",color:"error"},on:{click:function(i){return t.interruptBatch(e.id)}}},[t._v(" Interrupt "),a("v-icon",{attrs:{right:""}},[t._v(" mdi-pause ")])],1):a("v-btn",{attrs:{text:"",color:"error"},on:{click:function(i){return t.runBatch(e.id)}}},[t._v(" Resume "),a("v-icon",{attrs:{right:""}},[t._v(" mdi-skip-next ")])],1)]:t._e(),e.current_user_can_edit?a("v-btn",{attrs:{text:""},on:{click:function(i){return t.deleteBatchConfirm(e.id)}}},[t._v(" Unlink "),a("v-icon",{attrs:{right:""}},[t._v(" mdi-link-variant-off ")])],1):t._e()],2)]}}])})],1)},u=[];const d={data(){return{interval:null,search:"",totalItems:0,pagination:{},loading:!0,batches:[],headers:[{text:"Name",align:"start",value:"name"},{text:"Status",value:"status",align:"end"},{text:"Length",value:"total_jobs",align:"end"},{text:"Progress",value:"waiting_jobs",align:"end"},{text:"Actions",value:"actions",align:"end"}]}},mounted(){this.load(),this.interval=setInterval(()=>{this.load()},5e3)},beforeDestroy:function(){clearInterval(this.interval)},methods:{async load(){const t=await this.axios.get(`${this.$serverAddr}/batches`,{params:{page:this.pagination.page,per_page:this.pagination.itemsPerPage}}).then(n=>n.data);this.batches=t.items,this.totalItems=t.total,this.loading=!1},async runBatch(t){this.loading=!0;try{await this.axios.post(`${this.$serverAddr}/batches/${t}/run`),this.load()}catch(n){console.error(n)}},async interruptBatch(t){this.loading=!0;try{await this.axios.post(`${this.$serverAddr}/batches/${t}/interrupt`),this.load()}catch(n){console.error(n)}},deleteBatchConfirm(t){this.$root.$confirm("Unlink Batch","This will unlink jobs from this batch and remove the batch. Jobs will not be discarded. If a job is currently running, it will finish normally. Are you sure?").then(async n=>{this.loading=!0;try{await this.axios.delete(`${this.$serverAddr}/batches/${t}`),this.load()}catch(a){console.error(a)}})}}},r={};var h=c(d,l,u,!1,v,null,null,null);function v(t){for(let n in r)this[n]=r[n]}var p=function(){return h.exports}();export{p as default};
