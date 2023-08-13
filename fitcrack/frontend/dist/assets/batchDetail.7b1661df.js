import{a as v,j as h}from"./iconMaps.0c6dd037.js";import{w as u}from"./jobWorkunits.ff0b6f2f.js";import{c as _}from"./jobContribution.20a25215.js";import{d as m}from"./vuedraggable.umd.e6ccf9cf.js";import{n as b}from"./index.4ca078ea.js";import"./timeseries.c035184d.js";var p=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-toolbar",{attrs:{flat:""}},[a("v-chip",[a("v-fade-transition",{attrs:{mode:"out-in"}},[t.loading?a("v-progress-circular",{staticClass:"back-margin",attrs:{size:"16",width:"2",indeterminate:""}}):a("span",[t._v(" "+t._s(t.data.total_jobs)+" ")])],1)],1),a("h2",{staticClass:"ml-4"},[t._v(" "+t._s(t.data?t.data.name:"...")+" ")]),a("v-spacer"),t.data&&t.data.current_user_can_edit?a("div",[a("transition",{attrs:{name:"fade",mode:"out-in"}},[t.editing?a("div",{key:"renameEditPanel",staticClass:"d-flex align-center"},[a("v-text-field",{staticClass:"mr-2",attrs:{"hide-details":""},model:{value:t.data.name,callback:function(s){t.$set(t.data,"name",s)},expression:"data.name"}}),a("v-btn",{attrs:{text:"",loading:t.loading},on:{click:t.saveEdit}},[a("v-icon",{attrs:{left:""}},[t._v(" mdi-content-save ")]),t._v(" Save ")],1),a("v-btn",{attrs:{text:"",ripple:!1},on:{click:t.undoEdit}},[a("v-icon",{attrs:{left:""}},[t._v(" mdi-undo-variant ")]),t._v(" Undo changes ")],1)],1):a("div",{key:"batchActionsPanel"},[a("v-btn",{attrs:{text:"",ripple:!1},on:{click:function(s){t.editing=!0}}},[a("v-icon",{attrs:{left:""}},[t._v(" mdi-pencil ")]),t._v(" Edit Batch ")],1),a("v-btn",{attrs:{text:""},on:{click:t.deleteBatchConfirm}},[a("v-icon",{attrs:{left:""}},[t._v(" mdi-link-variant-off ")]),t._v(" Unlink Batch ")],1)],1)])],1):t._e()],1),t.data?a("div",{staticClass:"container"},[a("v-card",{staticClass:"mb-6"},[a("v-card-title",[a("v-icon",{attrs:{left:""}},[t._v(" "+t._s(t.data.status.icon)+" ")]),a("span",[t._v(t._s(t.data.status.text))]),a("v-spacer"),t.data.waiting_jobs>0?a("span",[t._v(" "+t._s(t.data.waiting_jobs)+" waiting to run ")]):t._e()],1),a("v-card-text",[a("v-progress-linear",{attrs:{value:t.totalProgress,"buffer-value":t.totalBuffer,stream:"",rounded:""}}),a("v-row",[a("v-col",{staticClass:"text-end"},[t._v(" "+t._s(t.totalProgress)+" % ")])],1)],1),t.data.current_user_can_operate?a("v-card-actions",[t.data.status.code<1?a("v-btn",{attrs:{color:"success"},on:{click:t.runBatch}},[t._v(" Run "),a("v-icon",{attrs:{right:""}},[t._v(" mdi-play ")])],1):t.data.status.code<2?a("v-btn",{attrs:{color:"error"},on:{click:t.interruptBatch}},[t._v(" Interrupt "),a("v-icon",{attrs:{right:""}},[t._v(" mdi-pause ")])],1):t.data.status.code<3?a("v-btn",{attrs:{color:"error"},on:{click:t.runBatch}},[t._v(" Resume "),a("v-icon",{attrs:{right:""}},[t._v(" mdi-skip-next ")])],1):t._e()],1):t._e()],1),a("v-alert",{directives:[{name:"show",rawName:"v-show",value:t.editing,expression:"editing"}],attrs:{type:"info"}},[t._v(" Drag jobs to change run order ")]),a("draggable",{attrs:{animation:150,disabled:!t.editing},on:{change:function(s){t.sorting=void 0}},model:{value:t.data.jobs,callback:function(s){t.$set(t.data,"jobs",s)},expression:"data.jobs"}},t._l(t.data.jobs,function(s){var r=s.id,c=s.name,d=s.attack,i=s.progress,n=s.status_text,l=s.status_type;return a("v-list-item",{key:r},[a("v-list-item-action",[a("v-icon",{attrs:{color:l}},[t._v(" "+t._s(t.jobIcon(n))+" ")])],1),a("v-list-item-content",[a("v-list-item-title",{staticClass:"font-weight-bold"},[a("router-link",{attrs:{to:{name:"jobDetail",params:{id:r}}}},[t._v(" "+t._s(c)+" ")]),a("v-progress-linear",{staticClass:"my-1",attrs:{value:i,rounded:"",height:"2"}})],1),a("v-list-item-subtitle",[a("strong",[a("span",{directives:[{name:"show",rawName:"v-show",value:i>0&&i<100,expression:"progress > 0 && progress < 100"}]},[t._v(t._s(i)+" %")]),t._v(" "),a("span",{staticClass:"text-capitalize"},[t._v(t._s(n)+" ")])]),a("span",[t._v(t._s(d)+" attack")])])],1),t.editing?a("v-list-item-action",[a("v-btn",{attrs:{text:""},on:{click:function(w){return t.unqueueJob(r)}}},[a("span",[t._v("Unqueue")]),a("v-icon",{attrs:{right:""}},[t._v(" mdi-tray-remove ")])],1)],1):t._e()],1)}),1),a("v-card",{staticClass:"mt-6"},[a("v-card-text",[a("v-row",[a("v-col",{attrs:{cols:"3"}},[a("v-card-title",[t._v(" Host contribution ")]),a("contribution-chart",{attrs:{batch:"",id:t.batchId}}),a("div",{staticClass:"mt-4 caption text-justify"},[t._v(" For each host that contributed, this is a sum of all hashes from all job's workunits in this batch. For more info on distribution and progress, see detailed view for each job. ")])],1),a("v-col",{attrs:{cols:"9"}},[a("v-card-title",[t._v(" Hashes in workunits over time ")]),a("workunit-chart",{attrs:{batch:"",id:t.batchId}})],1)],1)],1)],1)],1):t._e()],1)},f=[];const g={components:{draggable:m,contributionChart:_,workunitChart:u},data(){return{interval:null,data:null,original:null,editing:!1,loading:!0,hostPercentageGraph:null,hostGraph:null}},computed:{batchId(){return parseInt(this.$route.params.id)},totalProgress(){if(!this.data)return 0;const t=this.data.jobs.reduce((e,a)=>e+=a.progress,0);return Math.round(100/(100*this.data.total_jobs)*t)},totalBuffer(){return this.data?100/this.data.total_jobs*(this.data.total_jobs-this.data.waiting_jobs):0}},mounted(){this.load(),this.interval=setInterval(()=>{this.editing||this.load()},5e3)},beforeDestroy:function(){clearInterval(this.interval)},methods:{attackIcon:v,jobIcon:h,async load(){this.data=await this.axios.get(`${this.$serverAddr}/batches/${this.batchId}`).then(t=>t.data),this.original={...this.data},this.loading=!1},deleteBatchConfirm(){this.$root.$confirm("Unlink Batch","This will unlink jobs from this batch and remove the batch. Jobs will not be discarded. If a job is currently running, it will finish normally. Are you sure?").then(async t=>{try{await this.axios.delete(`${this.$serverAddr}/batches/${this.data.id}`),this.$router.push("/batches")}catch(e){console.error(e)}})},async saveEdit(){this.loading=!0;try{await this.axios.put(`${this.$serverAddr}/batches`,{id:this.data.id,name:this.data.name,jobs:this.data.jobs.map(t=>t.id)})}catch(t){console.error(t)}finally{this.editing=!1,this.load()}},undoEdit(){this.editing=!1,this.data={...this.original}},unqueueJob(t){this.data.jobs=this.data.jobs.filter(e=>e.id!=t)},async runBatch(){try{await this.axios.post(`${this.$serverAddr}/batches/${this.data.id}/run`),this.load()}catch(t){console.error(t)}},async interruptBatch(){try{await this.axios.post(`${this.$serverAddr}/batches/${this.data.id}/interrupt`),this.load()}catch(t){console.error(t)}}}},o={};var x=b(g,p,f,!1,k,"64ebd0d1",null,null);function k(t){for(let e in o)this[e]=o[e]}var A=function(){return x.exports}();export{A as default};
