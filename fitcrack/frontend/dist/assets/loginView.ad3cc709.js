import{_ as i,a as o}from"./logo-light.4fa25edf.js";import{n}from"./index.358b521f.js";import"./vendor.6aa46313.js";var l="/assets/motive.ceb5a355.svg",c=function(){var s=this,a=s.$createElement,e=s._self._c||a;return e("transition",{attrs:{name:"fade-transition"}},[e("v-container",{staticClass:"fill-height",attrs:{fluid:""}},[e("img",{staticClass:"motive",attrs:{src:l}}),e("div",{staticClass:"main mx-auto"},[s.$vuetify.theme.dark?e("img",{staticClass:"mx-auto pt-3 pb-3 d-block logo",attrs:{src:i,alt:"logo"}}):e("img",{staticClass:"mx-auto pt-3 pb-3 d-block logo",attrs:{src:o,alt:"logo"}}),e("div",{staticClass:"content"},[e("v-progress-circular",{staticClass:"progress trans",class:{hide:!s.loading},attrs:{size:"50",width:3,indeterminate:"",color:"primary"}}),e("v-form",{ref:"form",staticClass:"trans",class:{hide:s.loading},attrs:{"lazy-validation":""}},[e("v-text-field",{attrs:{solo:"",label:"Username",required:""},model:{value:s.username,callback:function(t){s.username=t},expression:"username"}}),e("v-text-field",{attrs:{solo:"",label:"Password",required:"",type:"password"},model:{value:s.password,callback:function(t){s.password=t},expression:"password"}}),e("v-btn",{staticClass:"d-block mx-auto mb-4",attrs:{type:"submit",color:"primary",disabled:!s.username||!s.password},on:{click:function(t){return t.preventDefault(),s.submit.apply(null,arguments)}}},[s._v(" sign in ")])],1)],1),e("div",{staticClass:"version"},[s._v(" "+s._s(s.version)+" ")])])])],1)},d=[];const u={name:"LoginView",data(){return{username:null,password:null,loading:!0,version:"2.5.0-dev"}},created(){this.$store.state.user.loggedIn?this.$router.replace({name:"home"}):this.loading=!1},methods:{async submit(){this.loading=!0,await this.$store.dispatch("signIn",{username:this.username,password:this.password})||(this.loading=!1)}}},r={};var _=n(u,c,d,!1,m,"0bd3433c",null,null);function m(s){for(let a in r)this[a]=r[a]}var g=function(){return _.exports}();export{g as default};
