import{t as l}from"./fc_tile.6627553d.js";import{F as d}from"./fileUploader.0013850c.js";import{n as m}from"./index.f3e5e66e.js";import"./vendor.6aa46313.js";var u=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("v-container",{staticClass:"max500"},[t("fc-tile",{staticClass:"ma-2",attrs:{title:"Mask sets",icon:e.$route.meta.icon}},[t("v-alert",{staticClass:"mb-0",attrs:{tile:"",text:"",type:"warning"}},[e._v(" Mask files must have a .txt or .hcmask extension. ")]),t("v-data-table",{attrs:{headers:e.headers,items:e.masks.items,loading:e.loading,"footer-props":{itemsPerPageOptions:[10,25,50],itemsPerPageText:"Masks per page"}},scopedSlots:e._u([{key:"item.name",fn:function(n){var s=n.item;return[t("router-link",{attrs:{to:"masks/"+s.id}},[e._v(" "+e._s(s.name)+" ")])]}},{key:"item.time",fn:function(n){var s=n.item;return[e._v(" "+e._s(e.$moment.utc(s.time).local().format("DD.MM.YYYY HH:mm"))+" ")]}},{key:"item.actions",fn:function(n){var s=n.item;return[t("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(o){var r=o.on;return[t("a",e._g({attrs:{href:e.$serverAddr+"/masks/"+s.id+"/download",target:"_blank",download:""}},r),[t("v-btn",{attrs:{icon:""}},[t("v-icon",[e._v("mdi-file-download-outline")])],1)],1)]}}],null,!0)},[t("span",[e._v("Download")])]),t("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(o){var r=o.on;return[t("v-btn",e._g({attrs:{icon:""},on:{click:function(p){return e.deleteMask(s)}}},r),[t("v-icon",{attrs:{color:"error"}},[e._v(" mdi-delete-outline ")])],1)]}}],null,!0)},[t("span",[e._v("Delete")])])]}}])}),t("v-divider"),t("file-uploader",{attrs:{url:this.$serverAddr+"/masks/add"},on:{uploadComplete:e.loadMasks}})],1)],1)},c=[];const v={name:"MasksView",components:{FileUploader:d,"fc-tile":l},data:function(){return{loading:!1,masks:[],headers:[{text:"Name",align:"start",value:"name"},{text:"Added",value:"time",align:"end"},{text:"Actions",value:"actions",align:"end",sortable:!1}]}},mounted:function(){this.loadMasks()},methods:{loadMasks:function(){this.loading=!0,this.axios.get(this.$serverAddr+"/masks",{}).then(e=>{this.masks=e.data,this.loading=!1})},deleteMask:function(e){this.$root.$confirm("Delete",`This will remove ${e.name} from your masks. Are you sure?`).then(a=>{this.loading=!0,this.axios.delete(this.$serverAddr+"/masks/"+e.id).then(t=>{this.loadMasks()})})}}},i={};var _=m(v,u,c,!1,f,"6caa3144",null,null);function f(e){for(let a in i)this[a]=i[a]}var y=function(){return _.exports}();export{y as default};
