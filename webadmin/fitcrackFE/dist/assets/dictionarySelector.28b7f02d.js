import{f as n}from"./numberFormat.773889d3.js";import{s as o}from"./selectorMixin.e926cffb.js";import{n as l}from"./index.274603af.js";var m=function(){var e=this,s=e.$createElement,i=e._self._c||s;return i("v-data-table",{attrs:{headers:e.headers,items:e.items,"items-per-page":e.itemsPerPage,"footer-props":e.footerProps,search:e.search,"item-key":"id","show-select":"","single-select":!e.selectAll},on:{"item-selected":e.itemSelected,"toggle-select-all":e.onSelectAll},scopedSlots:e._u([{key:"item.name",fn:function(t){var a=t.item;return[i("router-link",{attrs:{to:{name:"dictionaryDetail",params:{id:a.id}}}},[e._v(" "+e._s(a.name)+" "),i("v-icon",{attrs:{small:"",color:"primary"}},[e._v(" mdi-open-in-new ")])],1)]}},{key:"item.keyspace",fn:function(t){var a=t.item;return[e._v(" "+e._s(e.fmt(a.keyspace))+" ")]}},{key:"item.time",fn:function(t){var a=t.item;return[e._v(" "+e._s(e.$moment.utc(a.time).local().format("DD.MM.YYYY HH:mm"))+" ")]}}]),model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}})},c=[];const d={name:"DictionarySelector",mixins:[o],data(){return{headers:[{text:"Name",align:"start",value:"name"},{text:"Keyspace",value:"keyspace",align:"end"},{text:"Time",value:"time",align:"end"}]}},methods:{fmt:n,getData(){this.loading=!0,this.axios.get(this.$serverAddr+"/dictionary").then(e=>{this.items=e.data.items,this.loading=!1})}}},r={};var u=l(d,m,c,!1,f,null,null,null);function f(e){for(let s in r)this[s]=r[s]}var h=function(){return u.exports}();export{h as d};
