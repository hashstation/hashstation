import"./index.5ec60ee4.js";import{n as o}from"./index.da3d14d6.js";import"./index.332e8989.js";import"./vendor.6aa46313.js";var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"cont"},[t("v-row",{staticClass:"align-center"},[t("v-col",[t("v-btn",{staticClass:"mr-2",attrs:{text:""},on:{click:function(i){e.createNewNotificationSetting=!0}}},[t("v-icon",{attrs:{left:""}},[e._v(" mdi-plus ")]),e._v(" Add ")],1)],1)],1),t("v-data-table",{ref:"table",attrs:{headers:e.headers,items:e.notificationServices,options:e.pagination,"server-items-length":e.totalItems,loading:e.loading,"footer-props":{itemsPerPageOptions:[25,50,100],itemsPerPageText:"Services per page"},"fixed-header":""},on:{"update:options":function(i){e.pagination=i}},scopedSlots:e._u([{key:"item.service_name",fn:function(i){var n=i.item;return[e._v(" "+e._s(n.service_name)+" ")]}},{key:"item.enabled",fn:function(i){var n=i.item;return[e._v(" "+e._s(n.enabled?"Yes":"No")+" ")]}}])})],1)},c=[];const l={name:"NotificationServicesView",data:function(){return{interval:null,totalItems:0,pagination:{},loading:!0,createNewNotificationSetting:!1,headers:[{text:"Name",align:"start",value:"service_name"},{text:"Enabled",value:"enabled",align:"center",sortable:!1}],notificationServices:[]}},watch:{pagination:{handler:"updateList",deep:!0},"$route.name":"updateList"},mounted(){this.interval=setInterval(function(){this.loadNotificationServices()}.bind(this),5e3)},beforeDestroy:function(){clearInterval(this.interval)},methods:{loadNotificationServices(){this.axios.get(this.$serverAddr+"/notificationServices",{params:{page:this.pagination.page,per_page:this.pagination.itemsPerPage}}).then(e=>{this.notificationServices=e.data.items,this.totalItems=e.data.total,this.loading=!1})},updateList(){this.loading=!0,this.loadNotificationServices()}}},s={};var d=o(l,r,c,!1,v,"76e9551f",null,null);function v(e){for(let a in s)this[a]=s[a]}var p=function(){return d.exports}();export{p as default};