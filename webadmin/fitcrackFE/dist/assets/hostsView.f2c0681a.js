import{i as r}from"./index.09a07ba8.js";import{n as c}from"./index.855ed67c.js";import"./index.a9d6c6c2.js";import"./vendor.6aa46313.js";var u=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"cont"},[t("div",{staticClass:"d-flex justify-space-between align-center px-4 pt-2"},[t("v-switch",{staticClass:"mr-4",attrs:{label:"View hidden hosts","prepend-icon":e.viewHidden?"mdi-eye-off":"mdi-eye"},model:{value:e.viewHidden,callback:function(s){e.viewHidden=s},expression:"viewHidden"}}),t("v-text-field",{staticClass:"px-2 pt-3",attrs:{clearable:"","prepend-inner-icon":"mdi-table-search",label:"Search","single-line":""},on:{input:e.updateList},model:{value:e.search,callback:function(s){e.search=s},expression:"search"}})],1),t("v-divider"),t("v-data-table",{ref:"table",attrs:{headers:e.headers,items:e.hosts,search:e.search,options:e.pagination,"server-items-length":e.totalItems,loading:e.loading,"footer-props":{itemsPerPageOptions:[25,50,100],itemsPerPageText:"Hosts per page"},"fixed-header":""},on:{"update:options":function(s){e.pagination=s}},scopedSlots:e._u([{key:"item.domain_name",fn:function(s){var n=s.item;return[t("router-link",{staticClass:"middle font-weight-bold",attrs:{to:{name:"hostDetail",params:{id:n.id}}}},[e._v(" "+e._s(n.domain_name+" ("+e.fixUserNameEncoding(n.user.name)+")")+" ")])]}},{key:"item.jobs",fn:function(s){var n=s.item;return[e._v(" "+e._s(n.jobs.map(function(i){return i.status===10?1:0}).reduce(function(i,o){return i+o},0))+" ")]}},{key:"item.p_model",fn:function(s){var n=s.item;return[t("span",{staticClass:"oneline"},[e._v(e._s(n.p_model.replace(/(?:\(R\)|\(TM\)|Intel|AMD)/g,"")))])]}},{key:"item.last_active",fn:function(s){var n=s.item;return[n.last_active.seconds_delta>61?t("span",[e._v(e._s(e.parseTimeDelta(n.last_active.last_seen)))]):t("v-icon",{attrs:{color:"success"}},[e._v(" mdi-power ")])]}},{key:"item.actions",fn:function(s){var n=s.item;return[t("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(i){var o=i.on;return[t("v-btn",e._g({staticClass:"mx-0",attrs:{icon:""},on:{click:function(d){return e.unassignAllJobs(n.id)}}},o),[t("v-icon",[e._v(" "+e._s("mdi-lan-disconnect")+" ")])],1)]}}],null,!0)},[t("span",[e._v("Unassign from all jobs")])]),t("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(i){var o=i.on;return[t("v-btn",e._g({staticClass:"mx-0",attrs:{icon:""},on:{click:function(d){return e.hideHost(n.id)}}},o),[t("v-icon",[e._v(" "+e._s(n.deleted?"mdi-eye":"mdi-eye-off")+" ")])],1)]}}],null,!0)},[t("span",[e._v(e._s(n.deleted?"Show":"Hide"))])])]}}])})],1)},v=[];const m={name:"HostsView",data:function(){return{interval:null,search:"",viewHidden:!1,totalItems:0,pagination:{},loading:!0,headers:[{text:"Name",align:"start",value:"domain_name"},{text:"IP address",value:"ip_address",align:"end",sortable:!1},{text:"Operating system",value:"os_name",align:"end",sortable:!1},{text:"Processor",value:"p_model",align:"end",width:"200",sortable:!1},{text:"Active jobs",value:"jobs",align:"center",sortable:!1},{text:"Online",value:"last_active",align:"center",sortable:!1},{text:"Actions",value:"actions",align:"center",sortable:!1}],hosts_statuses:[],hosts:[]}},watch:{pagination:{handler:"updateList",deep:!0},"$route.name":"updateList",viewHidden:"updateList"},mounted(){this.interval=setInterval(function(){this.loadHosts()}.bind(this),5e3)},beforeDestroy:function(){clearInterval(this.interval)},methods:{parseTimeDelta:function(e){return e!=null?this.$moment.utc(e).fromNow():"Unknown"},loadHosts(){this.axios.get(this.$serverAddr+"/hosts",{params:{page:this.pagination.page,per_page:this.pagination.itemsPerPage,order_by:this.pagination.sortBy[0],descending:this.pagination.sortDesc[0],name:this.search,showDeleted:this.viewHidden}}).then(e=>{this.hosts=e.data.items,this.totalItems=e.data.total,this.loading=!1})},updateList(){this.loading=!0,this.loadHosts()},hideHost:function(e){this.loading=!0,this.axios.delete(this.$serverAddr+"/hosts/"+e).then(a=>{this.loadHosts()})},unassignAllJobs:function(e){this.axios.put(this.$serverAddr+"/hosts/"+e+"/unassignAllJobs").then(a=>{this.loadHosts()})},fixUserNameEncoding:function(e){return r.decode(r.encode(e,"latin1"),"utf-8")}}},l={};var p=c(m,u,v,!1,h,"726034f7",null,null);function h(e){for(let a in l)this[a]=l[a]}var x=function(){return p.exports}();export{x as default};