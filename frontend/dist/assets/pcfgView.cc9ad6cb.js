import{f as l}from"./numberFormat.773889d3.js";import{t as c}from"./fc_tile.de20d296.js";import{f as d}from"./fileCreator.e9669ac0.js";import{n as f}from"./index.de89a9d4.js";import"./dictionarySelector.77189ee5.js";import"./selectorMixin.45cc765c.js";import"./fileUploader.7cf6f9c7.js";import"./vendor.6aa46313.js";var m=function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("v-container",[t("fc-tile",{staticClass:"ma-2",attrs:{title:"PCFGs",icon:e.$route.meta.icon}},[t("v-alert",{staticClass:"mb-0",attrs:{tile:"",text:"",type:"warning"}},[e._v(" PCFG files must have a .zip extension. ")]),t("v-data-table",{attrs:{headers:e.headers,items:e.pcfg.items,loading:e.loading,"footer-props":{itemsPerPageOptions:[10,25,50],itemsPerPageText:"PCFGs per page"}},scopedSlots:e._u([{key:"item.name",fn:function(i){var a=i.item,r=a.id,n=a.name;return[t("router-link",{staticClass:"font-weight-bold",attrs:{to:{name:"pcfgBrowser",params:{id:r}}}},[e._v(" "+e._s(n)+" ")])]}},{key:"item.keyspace",fn:function(i){var a=i.item;return[e._v(" "+e._s(e.fmt(a.keyspace))+" ")]}},{key:"item.time_added",fn:function(i){var a=i.item;return[e._v(" "+e._s(e.$moment.utc(a.time_added).local().format("DD.MM.YYYY HH:mm"))+" ")]}},{key:"item.actions",fn:function(i){var a=i.item;return[t("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(r){var n=r.on;return[t("a",e._g({attrs:{href:e.$serverAddr+"/pcfg/"+a.id,target:"_blank",download:""}},n),[t("v-btn",{attrs:{icon:""}},[t("v-icon",[e._v("mdi-file-download-outline")])],1)],1)]}}],null,!0)},[t("span",[e._v("Download")])]),t("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(r){var n=r.on;return[t("v-btn",e._g({attrs:{icon:""},on:{click:function(_){return e.deletePcfg(a)}}},n),[t("v-icon",{attrs:{color:"error"}},[e._v(" mdi-delete-outline ")])],1)]}}],null,!0)},[t("span",[e._v("Delete")])])]}}])}),t("div",{staticClass:"text-right pa-3"},[t("v-btn",{staticClass:"d-inline-block",attrs:{color:"primary",outlined:""},nativeOn:{click:function(i){i.stopPropagation(),e.dialog=!0}}},[e._v(" Add new ")])],1)],1),t("file-creator",{attrs:{title:"Add new PCFG grammar","upload-url":this.$serverAddr+"/pcfg/add",working:e.working},on:{fileUploaded:e.loadPcfg,dictionarySelected:e.makePcfgFromDictionary},model:{value:e.dialog,callback:function(i){e.dialog=i},expression:"dialog"}})],1)},u=[];const p={name:"PcfgView",components:{fileCreator:d,"fc-tile":c},data:function(){return{working:!1,dialog:!1,loading:!1,headers:[{text:"Name",align:"left",value:"name"},{text:"Keyspace",value:"keyspace",align:"start"},{text:"Added",value:"time_added",align:"end"},{text:"Actions",value:"actions",align:"end",sortable:!1}],pcfg:[]}},mounted:function(){this.loadPcfg()},methods:{fmt:l,loadPcfg:function(){this.loading=!0,this.axios.get(this.$serverAddr+"/pcfg",{}).then(e=>{this.pcfg=e.data,this.loading=!1})},makePcfgFromDictionary:function(e,o){this.working=!0,this.axios.post(this.$serverAddr+"/pcfg/makeFromDictionary",{dictionary_id:e,name:o}).then(t=>{this.working=!1,this.dialog=!1,this.loadPcfg()}).catch(t=>{this.working=!1})},deletePcfg:function(e){this.$root.$confirm("Delete",`This will remove ${e.name} from your PCFGs. Are you sure?`).then(o=>{this.loading=!0,this.axios.delete(this.$serverAddr+"/pcfg/"+e.id).then(t=>{this.loadPcfg()})})}}},s={};var v=f(p,m,u,!1,g,"9c5ff394",null,null);function g(e){for(let o in s)this[o]=s[o]}var b=function(){return v.exports}();export{b as default};
