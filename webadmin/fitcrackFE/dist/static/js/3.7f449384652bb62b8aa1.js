webpackJsonp([3],{458:function(t,e,a){"use strict";function n(t){a(706)}Object.defineProperty(e,"__esModule",{value:!0});var i=a(550),o=a(708),r=a(29),s=n,l=r(i.a,o.a,!1,s,"data-v-cbd0d098",null);e.default=l.exports},474:function(t,e,a){"use strict";e.a={name:"FcTile",props:{title:String,loading:Boolean,icon:String}}},475:function(t,e,a){"use strict";function n(t){a(476)}var i=a(474),o=a(478),r=a(29),s=n,l=r(i.a,o.a,!1,s,"data-v-7371d504",null);e.a=l.exports},476:function(t,e,a){var n=a(477);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a(446)("8138406e",n,!0,{})},477:function(t,e,a){e=t.exports=a(445)(!0),e.push([t.i,".white[data-v-7371d504]{min-width:300px;position:relative}.contentFcTile[data-v-7371d504]{position:relative;min-height:100px;width:100%;padding:0}.progress[data-v-7371d504]{top:0;bottom:0;left:0;right:0;margin:auto;position:absolute}.max64[data-v-7371d504]{max-height:64px}","",{version:3,sources:["/home/runner/work/fitcrack/fitcrack/webadmin/fitcrackFE/src/components/tile/fc_tile.vue"],names:[],mappings:"AACA,wBACE,gBAAiB,AACjB,iBAAmB,CACpB,AACD,gCACE,kBAAmB,AACnB,iBAAkB,AAClB,WAAY,AACZ,SAAW,CACZ,AACD,2BACE,MAAO,AACP,SAAU,AACV,OAAQ,AACR,QAAS,AACT,YAAa,AACb,iBAAmB,CACpB,AACD,wBACE,eAAiB,CAClB",file:"fc_tile.vue",sourcesContent:["\n.white[data-v-7371d504] {\n  min-width: 300px;\n  position: relative;\n}\n.contentFcTile[data-v-7371d504] {\n  position: relative;\n  min-height: 100px;\n  width: 100%;\n  padding: 0;\n}\n.progress[data-v-7371d504] {\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n  position: absolute;\n}\n.max64[data-v-7371d504] {\n  max-height: 64px;\n}\n\n"],sourceRoot:""}])},478:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",{staticClass:"mx-auto"},[a("v-card-title",[t.icon?a("v-icon",{attrs:{left:""}},[t._v("\n      "+t._s(t.icon)+"\n    ")]):t._e(),t._v("\n    "+t._s(t.title)+"\n  ")],1),t._v(" "),a("v-card-text",{staticClass:"contentFcTile"},[t.loading?a("v-skeleton-loader",{staticClass:"mx-auto",attrs:{type:"article"}}):t._t("default")],2)],1)},i=[],o={render:n,staticRenderFns:i};e.a=o},479:function(t,e,a){"use strict";e.a={name:"FileUploader",props:{multiple:Boolean,url:{type:String,default:this.$serverAddr},noUpload:Boolean,label:{type:String,default:"Select files"}},data:function(){return{selectedFiles:[],files:null,progress:0,showProgress:!1,fileUploaded:!1}},computed:{overSizeLimit:function(){return this.selectedFiles.some(function(t){return t.size>2e9})}},methods:{uploadChange:function(t){this.progress=Math.round(100*t.loaded/t.total),console.log(this.progress)},fileChange:function(t){this.files=new FormData,this.selectedFiles=[];for(var e=0;e<t.length;e++)this.selectedFiles.push({name:t[e].name,type:t[e].type||"n/a",size:t[e].size,modified:t[e].lastModifiedDate?t[e].lastModifiedDate.toLocaleDateString():"n/a"}),this.files.append("file",t[e],t[e].name);this.fileUploaded=!1,this.progress=0,this.$emit("filesChanged",t)},upload:function(){var t=this;this.showProgress=!0;var e={withCredentials:!0,headers:{"Content-type":"multipart/form-data"},onUploadProgress:this.uploadChange};this.axios.post(this.url,this.files,e).then(function(e){t.fileUploaded=!0,t.$emit("uploadComplete",e.data),t.files=null}).catch(function(t){console.log(t)})}}}},480:function(t,e,a){"use strict";e.a={props:{selectAll:{type:Boolean,default:!1},value:{type:Array,default:function(){return[]}}},data:function(){return{items:[],loading:!1,search:"",selected:[]}},mounted:function(){this.getData()},methods:{getData:function(){console.error("Selector component missing getData method")},updateSelected:function(){this.$emit("input",this.selected)}}}},481:function(t,e,a){"use strict";function n(t){a(482)}var i=a(479),o=a(484),r=a(29),s=n,l=r(i.a,o.a,!1,s,"data-v-2ca99aec",null);e.a=l.exports},482:function(t,e,a){var n=a(483);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a(446)("80eba1aa",n,!0,{})},483:function(t,e,a){e=t.exports=a(445)(!0),e.push([t.i,".uploadInput[data-v-2ca99aec]{max-width:250px}.form[data-v-2ca99aec]{max-width:100%;text-align:center}.uploadButton[data-v-2ca99aec]{margin-top:15px}.spacer[data-v-2ca99aec]{width:10px}","",{version:3,sources:["/home/runner/work/fitcrack/fitcrack/webadmin/fitcrackFE/src/components/fileUploader/fileUploader.vue"],names:[],mappings:"AACA,8BACE,eAAiB,CAClB,AACD,uBACE,eAAgB,AAChB,iBAAmB,CACpB,AACD,+BACE,eAAiB,CAClB,AACD,yBACE,UAAY,CACb",file:"fileUploader.vue",sourcesContent:["\n.uploadInput[data-v-2ca99aec] {\n  max-width: 250px;\n}\n.form[data-v-2ca99aec] {\n  max-width: 100%;\n  text-align: center;\n}\n.uploadButton[data-v-2ca99aec] {\n  margin-top: 15px;\n}\n.spacer[data-v-2ca99aec] {\n  width: 10px;\n}\n"],sourceRoot:""}])},484:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"pt-0 mt-0"},[t.overSizeLimit?a("v-alert",{attrs:{type:"error",tile:""}},[t._v("\n    Maximum size of uploaded file is 2 GB.\n  ")]):t._e(),t._v(" "),a("form",{staticClass:"form pa-2",attrs:{enctype:"multipart/form-data"}},[a("v-file-input",{staticClass:"mr-2",attrs:{outlined:"",chips:"","show-size":"",label:t.label,name:"file",multiple:t.multiple},on:{change:t.fileChange}}),t._v(" "),t.noUpload?t._e():a("v-btn",{attrs:{color:"primary",outlined:"",disabled:null===t.files||t.overSizeLimit},on:{click:function(e){return t.upload()}}},[t._v("\n      Upload\n      "),a("v-icon",{attrs:{right:""}},[t._v("\n        mdi-upload\n      ")])],1)],1),t._v(" "),a("v-progress-linear",{attrs:{query:!0,active:t.showProgress,color:"primary"},model:{value:t.progress,callback:function(e){t.progress=e},expression:"progress"}})],1)},i=[],o={render:n,staticRenderFns:i};e.a=o},487:function(t,e,a){"use strict";var n=a(488),i=a(498),o=a(29),r=o(n.a,i.a,!1,null,null,null);e.a=r.exports},488:function(t,e,a){"use strict";var n=a(480);e.a={name:"DictionarySelector",mixins:[n.a],data:function(){return{headers:[{text:"Name",align:"start",value:"name"},{text:"Keyspace",value:"keyspace",align:"end"},{text:"Time",value:"time",align:"end"}]}},methods:{getData:function(){var t=this;this.loading=!0,this.axios.get(this.$serverAddr+"/dictionary").then(function(e){t.items=e.data.items,t.loading=!1})}}}},498:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-data-table",{attrs:{headers:t.headers,items:t.items,search:t.search,"item-key":"id","show-select":""},on:{input:t.updateSelected},scopedSlots:t._u([{key:"item.name",fn:function(e){var n=e.item;return[a("router-link",{attrs:{to:{name:"dictionaryDetail",params:{id:n.id}}}},[t._v("\n      "+t._s(n.name)+"\n      "),a("v-icon",{attrs:{small:"",color:"primary"}},[t._v("\n        mdi-open-in-new\n      ")])],1)]}},{key:"item.time",fn:function(e){var a=e.item;return[t._v("\n    "+t._s(t.$moment(a.time).format("DD.MM.YYYY HH:mm"))+"\n  ")]}}]),model:{value:t.selected,callback:function(e){t.selected=e},expression:"selected"}})},i=[],o={render:n,staticRenderFns:i};e.a=o},499:function(t,e,a){"use strict";var n=a(487),i=a(481);e.a={components:{dictSelector:n.a,fileUploader:i.a},props:{value:Boolean,title:{type:String,default:"Upload or make from dictionary"},uploadUrl:{type:String,default:"#"},working:Boolean},data:function(){return{active:null,newName:"",selectedDict:[]}},computed:{open:{get:function(){return this.value},set:function(t){this.$emit("input",t)}}},methods:{fileUploaded:function(){this.$emit("fileUploaded"),this.open=!1},dictionarySelected:function(){this.$emit("dictionarySelected",this.selectedDict[0].id,this.newName)}}}},513:function(t,e,a){"use strict";var n=a(499),i=a(514),o=a(29),r=o(n.a,i.a,!1,null,null,null);e.a=r.exports},514:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-dialog",{attrs:{"max-width":"600"},model:{value:t.open,callback:function(e){t.open=e},expression:"open"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[t._v("\n      "+t._s(t.title)+"\n    ")]),t._v(" "),a("v-tabs",{model:{value:t.active,callback:function(e){t.active=e},expression:"active"}},[a("v-tab",{attrs:{ripple:""}},[t._v("\n        Upload file\n      ")]),t._v(" "),a("v-tab",{attrs:{ripple:""}},[t._v("\n        Make from dictionary\n      ")]),t._v(" "),a("v-tab-item",[a("v-card",{attrs:{text:""}},[a("file-uploader",{attrs:{url:t.uploadUrl},on:{uploadComplete:t.fileUploaded}})],1)],1),t._v(" "),a("v-tab-item",[t.working?a("div",{staticClass:"text-center"},[a("v-progress-circular",{staticClass:"ma-5",attrs:{size:"50",width:3,indeterminate:"",color:"primary"}})],1):a("v-card",{attrs:{flat:""}},[a("dict-selector",{model:{value:t.selectedDict,callback:function(e){t.selectedDict=e},expression:"selectedDict"}}),t._v(" "),a("v-card-actions",[a("v-text-field",{staticClass:"mr-2",attrs:{outlined:"",dense:"","hide-details":"",label:"Name"},model:{value:t.newName,callback:function(e){t.newName=e},expression:"newName"}}),t._v(" "),a("v-btn",{attrs:{color:"primary",outlined:"",disabled:0==t.selectedDict.length||""===t.newName},on:{click:t.dictionarySelected}},[t._v("\n              Make from dictionary\n            ")])],1)],1)],1)],1)],1)],1)},i=[],o={render:n,staticRenderFns:i};e.a=o},550:function(t,e,a){"use strict";var n=a(475),i=a(513);e.a={name:"PcfgView",components:{fileCreator:i.a,"fc-tile":n.a},data:function(){return{working:!1,dialog:!1,loading:!1,headers:[{text:"Name",align:"left",value:"name"},{text:"Keyspace",value:"keyspace",align:"start"},{text:"Added",value:"time_added",align:"end"},{text:"Actions",value:"actions",align:"end",sortable:!1}],pcfg:[]}},mounted:function(){this.loadPcfg()},methods:{loadPcfg:function(){var t=this;this.loading=!0,this.axios.get(this.$serverAddr+"/pcfg",{}).then(function(e){t.pcfg=e.data,t.loading=!1})},makePcfgFromDictionary:function(t,e){var a=this;this.working=!0,this.axios.post(this.$serverAddr+"/pcfg/makeFromDictionary",{dictionary_id:t,name:e}).then(function(t){a.working=!1,a.dialog=!1,a.loadPcfg()}).catch(function(t){a.working=!1})},deletePcfg:function(t){var e=this;this.$root.$confirm("Delete","This will remove "+t.name+" from your PCFGs. Are you sure?").then(function(a){e.loading=!0,e.axios.delete(e.$serverAddr+"/pcfg/"+t.id).then(function(t){e.loadPcfg()})})}}}},706:function(t,e,a){var n=a(707);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a(446)("31aa9d68",n,!0,{})},707:function(t,e,a){e=t.exports=a(445)(!0),e.push([t.i,".noEvent[data-v-cbd0d098]{pointer-events:none;display:inline-block}.dz-message[data-v-cbd0d098]{cursor:pointer;text-align:center}.max500[data-v-cbd0d098]{max-width:600px}","",{version:3,sources:["/home/runner/work/fitcrack/fitcrack/webadmin/fitcrackFE/src/components/pcfg/pcfgView.vue"],names:[],mappings:"AACA,0BACE,oBAAqB,AACrB,oBAAsB,CACvB,AACD,6BACE,eAAgB,AAChB,iBAAmB,CACpB,AACD,yBACE,eAAiB,CAClB",file:"pcfgView.vue",sourcesContent:["\n.noEvent[data-v-cbd0d098] {\n  pointer-events: none;\n  display: inline-block;\n}\n.dz-message[data-v-cbd0d098] {\n  cursor: pointer;\n  text-align: center;\n}\n.max500[data-v-cbd0d098] {\n  max-width: 600px;\n}\n\n"],sourceRoot:""}])},708:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{staticClass:"max500"},[a("fc-tile",{staticClass:"ma-2",attrs:{title:"PCFGs",icon:t.$route.meta.icon}},[a("v-alert",{staticClass:"mb-0",attrs:{tile:"",text:"",type:"warning"}},[t._v("\n      PCFG files must have a .zip extension.\n    ")]),t._v(" "),a("v-data-table",{attrs:{headers:t.headers,items:t.pcfg.items,loading:t.loading,"footer-props":{itemsPerPageOptions:[10,25,50],itemsPerPageText:"PCFGs per page"}},scopedSlots:t._u([{key:"item.time_added",fn:function(e){var a=e.item;return[t._v("\n        "+t._s(t.$moment(a.time_added).format("DD.MM.YYYY HH:mm"))+"\n      ")]}},{key:"item.actions",fn:function(e){var n=e.item;return[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("a",t._g({attrs:{href:t.$serverAddr+"/pcfg/"+n.id,target:"_blank",download:""}},i),[a("v-btn",{attrs:{icon:""}},[a("v-icon",[t._v("mdi-file-download-outline")])],1)],1)]}}],null,!0)},[t._v(" "),a("span",[t._v("Download")])]),t._v(" "),a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-btn",t._g({attrs:{icon:""},on:{click:function(e){return t.deletePcfg(n)}}},i),[a("v-icon",{attrs:{color:"error"}},[t._v("\n                mdi-delete-outline\n              ")])],1)]}}],null,!0)},[t._v(" "),a("span",[t._v("Delete")])])]}}])}),t._v(" "),a("div",{staticClass:"text-right pa-3"},[a("v-btn",{staticClass:"d-inline-block",attrs:{color:"primary",text:"",outlined:""},nativeOn:{click:function(e){e.stopPropagation(),t.dialog=!0}}},[t._v("\n        Add new\n      ")])],1)],1),t._v(" "),a("file-creator",{attrs:{title:"Add new PCFG grammar","upload-url":this.$serverAddr+"/pcfg/add",working:t.working},on:{fileUploaded:t.loadPcfg,dictionarySelected:t.makePcfgFromDictionary},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}})],1)},i=[],o={render:n,staticRenderFns:i};e.a=o}});
//# sourceMappingURL=3.7f449384652bb62b8aa1.js.map