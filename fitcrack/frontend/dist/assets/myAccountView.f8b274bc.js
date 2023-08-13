import{n as o}from"./index.4ca078ea.js";var n=function(){var s=this,r=s.$createElement,e=s._self._c||r;return e("v-container",[e("h2",[s._v(" My account ")]),e("v-row",{attrs:{justify:"center"}},[e("v-card",{staticClass:"mb-4",attrs:{"min-width":"300","max-width":"500"}},[e("v-card-title",[s._v(" "+s._s(s.username)+" ")]),e("v-card-text",[s._v(" "+s._s(s.mail)+" ")])],1)],1),e("v-row",{attrs:{justify:"center"}},[e("v-card",{attrs:{"min-width":"300","max-width":"500"}},[e("v-card-title",[s._v(" Change password ")]),e("v-card-text",[e("v-form",{ref:"form",attrs:{"lazy-validation":""}},[e("v-text-field",{attrs:{type:"password",label:"Current password",required:""},model:{value:s.oldPassword,callback:function(t){s.oldPassword=t},expression:"oldPassword"}}),e("v-text-field",{attrs:{type:"password",label:"New password",required:""},model:{value:s.newPassword0,callback:function(t){s.newPassword0=t},expression:"newPassword0"}}),e("v-text-field",{attrs:{type:"password",label:"Confirm new password",required:""},model:{value:s.newPassword1,callback:function(t){s.newPassword1=t},expression:"newPassword1"}})],1)],1),e("v-card-actions",[e("v-spacer"),e("v-btn",{attrs:{color:"primary",text:"",disabled:s.newPassword0!=s.newPassword1||s.oldPassword==null||s.newPassword0==null},on:{click:function(t){return t.stopPropagation(),s.editPassword.apply(null,arguments)}}},[s._v(" Update ")])],1)],1)],1)],1)},d=[];const l={name:"MyAccount",data:function(){return{username:this.$store.state.user.userData.username,mail:this.$store.state.user.userData.mail,oldPassword:null,newPassword0:null,newPassword1:null}},computed:{gradient:function(){return window.theme.gradient}},methods:{editPassword(){this.axios.post(this.$serverAddr+"/user/password/change_my_password",{old_password:this.oldPassword,new_password:this.newPassword1}).then(s=>{console.log(s.data),console.log("user password changed"),this.oldPassword="",this.newPassword0="",this.newPassword1=""})}}},a={};var i=o(l,n,d,!1,w,"f9bfcafa",null,null);function w(s){for(let r in a)this[r]=a[r]}var u=function(){return i.exports}();export{u as default};
