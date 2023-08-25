var B=Object.defineProperty,W=Object.defineProperties;var z=Object.getOwnPropertyDescriptors;var A=Object.getOwnPropertySymbols;var K=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var j=(e,s,t)=>s in e?B(e,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[s]=t,m=(e,s)=>{for(var t in s||(s={}))K.call(s,t)&&j(e,t,s[t]);if(A)for(var t of A(s))G.call(s,t)&&j(e,t,s[t]);return e},b=(e,s)=>W(e,z(s));import{V as c,R as O,a as d,b as T,C as Y,r as q,m as X,h as L,v as Q,c as Z,d as ee,e as te,f as $}from"./vendor.6aa46313.js";const se=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}};se();const re="modulepreload",P={},ne="/",a=function(s,t){return!t||t.length===0?s():Promise.all(t.map(r=>{if(r=`${ne}${r}`,r in P)return;P[r]=!0;const n=r.endsWith(".css"),i=n?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${i}`))return;const o=document.createElement("link");if(o.rel=n?"stylesheet":re,n||(o.as="script",o.crossOrigin=""),o.href=r,document.head.appendChild(o),n)return new Promise((f,l)=>{o.addEventListener("load",f),o.addEventListener("error",l)})})).then(()=>s())},ae=()=>a(()=>import("./dashboard.d4d64059.js"),["assets/dashboard.d4d64059.js","assets/dashboard.8e97ba4c.css","assets/iconMaps.0c6dd037.js","assets/jobWorkunits.5e88cbc0.js","assets/jobWorkunits.8857a959.css","assets/timeseries.9158092b.js","assets/vendor.6aa46313.js","assets/jobProgress.8f7d778e.js","assets/jobProgress.8f0ebe4d.css","assets/datetime.d8d63fcc.js"]),y=()=>a(()=>import("./jobsView.f2f40f49.js"),["assets/jobsView.f2f40f49.js","assets/jobsView.b13e4826.css","assets/iconMaps.0c6dd037.js","assets/spyfu-vuex-helpers.esm.87da45d6.js","assets/vendor.6aa46313.js","assets/hostEditor.cdd4af2d.js","assets/hostEditor.30ffe716.css","assets/hostSelector.80941dd8.js","assets/hostSelector.f5925a7f.css","assets/index.5ec60ee4.js","assets/index.332e8989.js","assets/selectorMixin.45cc765c.js","assets/numberFormat.773889d3.js","assets/vuedraggable.umd.f0e73259.js"]),ie=()=>a(()=>import("./jobDetailView.b56398ef.js"),["assets/jobDetailView.b56398ef.js","assets/jobDetailView.389d46c3.css","assets/datetime.d8d63fcc.js","assets/iconMaps.0c6dd037.js","assets/numberFormat.773889d3.js","assets/timeseries.9158092b.js","assets/vendor.6aa46313.js","assets/fc_textarea.7453528e.js","assets/fc_textarea.fce54816.css","assets/vue-infinite-loading.33b09e95.js","assets/hostEditor.cdd4af2d.js","assets/hostEditor.30ffe716.css","assets/hostSelector.80941dd8.js","assets/hostSelector.f5925a7f.css","assets/index.5ec60ee4.js","assets/index.332e8989.js","assets/selectorMixin.45cc765c.js","assets/jobProgress.8f7d778e.js","assets/jobProgress.8f0ebe4d.css","assets/jobWorkunits.5e88cbc0.js","assets/jobWorkunits.8857a959.css","assets/jobContribution.798e507e.js","assets/jobContribution.23ad0bc8.css","assets/fc_tile.824f39fe.js"]),oe=()=>a(()=>import("./batchList.1ed9fb1b.js"),["assets/batchList.1ed9fb1b.js","assets/vendor.6aa46313.js"]),le=()=>a(()=>import("./batchDetail.1f157d58.js"),["assets/batchDetail.1f157d58.js","assets/batchDetail.12346918.css","assets/iconMaps.0c6dd037.js","assets/jobWorkunits.5e88cbc0.js","assets/jobWorkunits.8857a959.css","assets/timeseries.9158092b.js","assets/vendor.6aa46313.js","assets/jobContribution.798e507e.js","assets/jobContribution.23ad0bc8.css","assets/vuedraggable.umd.f0e73259.js"]),ce=()=>a(()=>import("./loginView.f7f4fc6d.js"),["assets/loginView.f7f4fc6d.js","assets/loginView.ddd96d03.css","assets/vendor.6aa46313.js"]),de=()=>a(()=>import("./mainPage.b0fcb670.js"),["assets/mainPage.b0fcb670.js","assets/mainPage.35aec34a.css","assets/iconMaps.0c6dd037.js","assets/spyfu-vuex-helpers.esm.87da45d6.js","assets/vendor.6aa46313.js","assets/vuedraggable.umd.f0e73259.js"]),ue=()=>a(()=>import("./addJobView.7f902dce.js"),["assets/addJobView.7f902dce.js","assets/addJobView.64eb005f.css","assets/numberFormat.773889d3.js","assets/iconMaps.0c6dd037.js","assets/dictionarySelector.98e37afa.js","assets/selectorMixin.45cc765c.js","assets/spyfu-vuex-helpers.esm.87da45d6.js","assets/vendor.6aa46313.js","assets/fileUploader.a68c14c2.js","assets/fileUploader.db0bfc62.css","assets/fc_textarea.7453528e.js","assets/fc_textarea.fce54816.css","assets/vue-infinite-loading.33b09e95.js","assets/hostSelector.80941dd8.js","assets/hostSelector.f5925a7f.css","assets/index.5ec60ee4.js","assets/index.332e8989.js","assets/datetime.d8d63fcc.js"]),me=()=>a(()=>import("./templateList.2230eafb.js"),["assets/templateList.2230eafb.js","assets/fc_tile.824f39fe.js","assets/vendor.6aa46313.js"]),S=()=>a(()=>import("./hostsView.2ff69b25.js"),["assets/hostsView.2ff69b25.js","assets/hostsView.a2f24bf9.css","assets/index.5ec60ee4.js","assets/index.332e8989.js","assets/vendor.6aa46313.js"]),he=()=>a(()=>import("./hashCacheView.eb7b7516.js"),["assets/hashCacheView.eb7b7516.js","assets/hashCacheView.acc52be0.css","assets/vendor.6aa46313.js"]),pe=()=>a(()=>import("./dictionariesView.7359cb24.js"),["assets/dictionariesView.7359cb24.js","assets/dictionariesView.b7f4c43e.css","assets/numberFormat.773889d3.js","assets/fc_tile.824f39fe.js","assets/fileUploader.a68c14c2.js","assets/fileUploader.db0bfc62.css","assets/vendor.6aa46313.js"]),_e=()=>a(()=>import("./dictionaryDetailView.d238a5df.js"),["assets/dictionaryDetailView.d238a5df.js","assets/dictionaryDetailView.cd5b9974.css","assets/numberFormat.773889d3.js","assets/fc_textarea.7453528e.js","assets/fc_textarea.fce54816.css","assets/vue-infinite-loading.33b09e95.js","assets/vendor.6aa46313.js","assets/fc_tile.824f39fe.js"]),fe=()=>a(()=>import("./pcfgView.385567af.js"),["assets/pcfgView.385567af.js","assets/pcfgView.c4641056.css","assets/numberFormat.773889d3.js","assets/fc_tile.824f39fe.js","assets/fileCreator.cafe628f.js","assets/dictionarySelector.98e37afa.js","assets/selectorMixin.45cc765c.js","assets/fileUploader.a68c14c2.js","assets/fileUploader.db0bfc62.css","assets/vendor.6aa46313.js"]),ve=()=>a(()=>import("./pcfgBrowser.1f554353.js"),["assets/pcfgBrowser.1f554353.js","assets/pcfgBrowser.24e328de.css","assets/vendor.6aa46313.js"]),ge=()=>a(()=>import("./manageUsersView.2b802b6c.js"),["assets/manageUsersView.2b802b6c.js","assets/manageUsersView.623c2426.css","assets/vendor.6aa46313.js"]),be=()=>a(()=>import("./myAccountView.7a3a9c57.js"),["assets/myAccountView.7a3a9c57.js","assets/myAccountView.a835ddaf.css","assets/vendor.6aa46313.js"]),ye=()=>a(()=>import("./hostDetailView.40068ccd.js"),["assets/hostDetailView.40068ccd.js","assets/hostDetailView.39825d8d.css","assets/numberFormat.773889d3.js","assets/index.5ec60ee4.js","assets/index.332e8989.js","assets/fc_tile.824f39fe.js","assets/resourceMonitor.322768a2.js","assets/timeseries.9158092b.js","assets/vendor.6aa46313.js"]),ke=()=>a(()=>import("./rulesView.748822f8.js"),["assets/rulesView.748822f8.js","assets/rulesView.0b99d12c.css","assets/numberFormat.773889d3.js","assets/fc_tile.824f39fe.js","assets/fileUploader.a68c14c2.js","assets/fileUploader.db0bfc62.css","assets/vendor.6aa46313.js"]),we=()=>a(()=>import("./ruleDetailView.50ad9152.js"),["assets/ruleDetailView.50ad9152.js","assets/ruleDetailView.1e9bc3f3.css","assets/numberFormat.773889d3.js","assets/fc_tile.824f39fe.js","assets/fc_textarea.7453528e.js","assets/fc_textarea.fce54816.css","assets/vue-infinite-loading.33b09e95.js","assets/vendor.6aa46313.js"]),Ee=()=>a(()=>import("./masksView.1f7560ab.js"),["assets/masksView.1f7560ab.js","assets/masksView.a8d64b1a.css","assets/fc_tile.824f39fe.js","assets/fileUploader.a68c14c2.js","assets/fileUploader.db0bfc62.css","assets/vendor.6aa46313.js"]),Ie=()=>a(()=>import("./charsetsView.802c3db4.js"),["assets/charsetsView.802c3db4.js","assets/charsetsView.8c4db99d.css","assets/numberFormat.773889d3.js","assets/fc_tile.824f39fe.js","assets/fileUploader.a68c14c2.js","assets/fileUploader.db0bfc62.css","assets/vendor.6aa46313.js"]),De=()=>a(()=>import("./charsetDetailView.91de69ab.js"),["assets/charsetDetailView.91de69ab.js","assets/charsetDetailView.e8aa0450.css","assets/numberFormat.773889d3.js","assets/index.5ec60ee4.js","assets/index.332e8989.js","assets/fc_tile.824f39fe.js","assets/vendor.6aa46313.js"]),Ae=()=>a(()=>import("./markovView.04636213.js"),["assets/markovView.04636213.js","assets/markovView.58b0a5e8.css","assets/fc_tile.824f39fe.js","assets/fileCreator.cafe628f.js","assets/dictionarySelector.98e37afa.js","assets/numberFormat.773889d3.js","assets/selectorMixin.45cc765c.js","assets/fileUploader.a68c14c2.js","assets/fileUploader.db0bfc62.css","assets/vendor.6aa46313.js"]),je=()=>a(()=>import("./maskDetailView.0e670a64.js"),["assets/maskDetailView.0e670a64.js","assets/maskDetailView.9def3be8.css","assets/fc_tile.824f39fe.js","assets/vendor.6aa46313.js"]),Oe=()=>a(()=>import("./test.eb10c903.js"),["assets/test.eb10c903.js","assets/test.1c249e9b.css","assets/vue-infinite-loading.33b09e95.js","assets/vendor.6aa46313.js"]),Te=()=>a(()=>import("./pageNotFound.3759b206.js"),["assets/pageNotFound.3759b206.js","assets/pageNotFound.eb13d4c0.css","assets/vendor.6aa46313.js"]),Le=()=>a(()=>import("./encryptedFilesView.e390c1a2.js"),["assets/encryptedFilesView.e390c1a2.js","assets/encryptedFilesView.c2b5d277.css","assets/fc_tile.824f39fe.js","assets/vendor.6aa46313.js"]),$e=()=>a(()=>import("./serverMonitor.ddf0de7e.js"),["assets/serverMonitor.ddf0de7e.js","assets/serverMonitor.bc5a24bc.css","assets/resourceMonitor.322768a2.js","assets/timeseries.9158092b.js","assets/vendor.6aa46313.js","assets/datetime.d8d63fcc.js"]),Pe=()=>a(()=>import("./settingsView.4786a48d.js"),["assets/settingsView.4786a48d.js","assets/settingsView.2a34a71a.css","assets/vendor.6aa46313.js"]),Se=()=>a(()=>import("./dataTransfer.d6d933ab.js"),["assets/dataTransfer.d6d933ab.js","assets/dataTransfer.cd2c0f19.css","assets/vendor.6aa46313.js","assets/iconMaps.0c6dd037.js","assets/index.332e8989.js"]),xe=()=>a(()=>import("./unauthorized.79082a28.js"),["assets/unauthorized.79082a28.js","assets/unauthorized.b19fa34e.css","assets/vendor.6aa46313.js"]);c.use(O);const x=[{path:"/",name:"home",component:ae,meta:{title:"Dashboard",icon:"mdi-view-dashboard"}},{path:"/test",name:"test",component:Oe},{path:"/batches",name:"batches",component:oe,meta:{title:"Batches",icon:"mdi-tray-full",navtab:0}},{path:"/batches/:id",name:"batch",component:le,meta:{title:"Batch Detail"}},{path:"/jobs",name:"jobs",component:y,meta:{title:"Jobs",icon:"mdi-briefcase",navtab:0}},{path:"/bins/:id",name:"bins",component:y,meta:{title:"Bins",icon:"mdi-folder",navtab:0}},{path:"/bins/trash",name:"trash",component:y,meta:{title:"Trash",icon:"mdi-delete",navtab:0}},{path:"/jobs/add",name:"addJob",component:ue,meta:{guard:"ADD_NEW_JOB",title:"Create a job",icon:"mdi-briefcase-plus",navtab:0}},{path:"/jobs/:id",name:"jobDetail",component:ie,meta:{title:"Job detail"}},{path:"/templates",name:"templates",component:me,meta:{title:"Job templates",icon:"mdi-file",navtab:2}},{path:"/hosts",name:"hosts",component:S,meta:{title:"Hosts",icon:"mdi-desktop-classic",navtab:2}},{path:"/hosts/hidden",name:"hiddenHosts",component:S},{path:"/hosts/:id",name:"hostDetail",component:ye,meta:{title:"Host info"}},{path:"/hashes",name:"hashes",component:he,meta:{title:"Hashes",icon:"mdi-book-lock",navtab:1}},{path:"/dictionaries",name:"dictionaries",component:pe,meta:{title:"Dictionaries",icon:"mdi-dictionary",navtab:1}},{path:"/dictionaries/:id",name:"dictionaryDetail",component:_e},{path:"/pcfg",name:"pcfg",component:fe,meta:{title:"PCFG",icon:"mdi-ray-start-end",navtab:1}},{path:"/pcfg/:id",name:"pcfgBrowser",component:ve,meta:{title:"Inspect PCFG"}},{path:"/rules",name:"rules",component:ke,meta:{title:"Rules",icon:"mdi-gavel",navtab:1}},{path:"/rules/:id",name:"ruleDetail",component:we},{path:"/charsets",name:"charsets",component:Ie,meta:{title:"Charsets",icon:"mdi-alphabetical",navtab:1}},{path:"/charsets/:id",name:"charsetDetail",component:De},{path:"/masks",name:"masks",component:Ee,meta:{title:"Masks",icon:"mdi-guy-fawkes-mask",navtab:1}},{path:"/masks/:id",name:"maskDetail",component:je},{path:"/markovChains",name:"markovChains",component:Ae,meta:{title:"Markov chains",icon:"mdi-matrix",navtab:1}},{path:"/files",name:"files",component:Le,meta:{title:"Encrypted Files",icon:"mdi-file-lock",navtab:1}},{path:"/user/manageUsers",name:"manageUsers",component:ge,meta:{guard:"MANAGE_USERS",title:"Manage users",icon:"mdi-folder-account",navtab:2}},{path:"/myAccount",name:"myAccount",component:be,meta:{title:"My account",icon:"mdi-account"}},{path:"/server",name:"server",component:$e,meta:{title:"Server monitor",icon:"mdi-gauge",navtab:2}},{path:"/settings",name:"settings",component:Pe,meta:{title:"Settings",icon:"mdi-cogs",navtab:2}},{path:"/transfer",name:"transfer",component:Se,meta:{title:"Data Transfer",icon:"mdi-dolly",navtab:2}},{path:"/error/unauthorized",name:"unauthorized",component:xe,meta:{title:"Access Denied",icon:"mdi-alert"}},{path:"*",component:Te}],h=new O({mode:"history",routes:[{path:"/login",name:"login",component:ce},{path:"",component:de,children:x}]});h.beforeResolve(async(e,s,t)=>{const r=e.meta.guard;if(!r){t();return}await w.dispatch("hasPermission",r)?t():t({name:"unauthorized",query:{accessing:e.path,missing:r}})});h.afterEach((e,s)=>{const t=h.app.$store.state.project||"Fitcrack";e.meta.title?document.title=`${e.meta.title} \u2013 ${t}`:document.title=t});function lt(e){const s=x.find(t=>t.name===e);return s.meta&&s.meta.icon?s.meta.icon:null}const k=window.serverAddress,R={id:null,username:null,mail:null,role:{MANAGE_USERS:!1,ADD_NEW_JOB:!1,UPLOAD_DICTIONARIES:!1,VIEW_ALL_JOBS:!1,EDIT_ALL_JOBS:!1,OPERATE_ALL_JOBS:!1,ADD_USER_PERMISSIONS_TO_JOB:!1}};var Re={state:{loggedIn:!1,userData:R},getters:{can:e=>s=>e.userData.role[s]},mutations:{_setUser(e,s){s?(e.loggedIn=!0,e.userData=s):(e.loggedIn=!1,e.userData=R)}},actions:{async refreshUser({commit:e}){const{user:s,loggedIn:t,token:r}=await d.get(`${k}/user/isLoggedIn`).then(n=>n.data);return localStorage.setItem("jwt",r),e("_setUser",t?s:null),s},async resume({state:e,dispatch:s}){return e.loggedIn?!0:(await s("refreshUser")).id!=null},async signIn({commit:e},s){try{const{user:t,token:r}=await d.post(`${k}/user/login`,s).then(i=>i.data);localStorage.setItem("jwt",r),e("_setUser",t);const n=sessionStorage.getItem("loginRedirect");return sessionStorage.removeItem("loginRedirect"),!n||n==="/login"?h.replace({name:"home"}):h.push(n),!0}catch(t){return console.error(t),e("_setUser",null),!1}},async signOut({commit:e}){await d.get(`${k}/user/logout`),e("_setUser",null),h.push({name:"login"})},async hasPermission({state:e,dispatch:s},t){return e.loggedIn||await s("resume"),e.userData.role[t]}}};const C={selectedTemplate:0,step:1,validatedHashes:[],name:"",inputMethod:"multipleHashes",hashList:"",hashType:null,ignoreHashes:!1,hosts:[],startDate:null,endDate:null},v={template:"Empty",attackSettingsTab:void 0,comment:"",leftDicts:[],rightDicts:[],rules:[],ruleLeft:"",ruleRight:"",masks:[""],hybridMask:"",charset:[],priority:1,submode:0,distributionMode:0,dictDeploymentMode:0,markov:[],markovThresh:NaN,pcfg:[],keyspaceLimit:0,checkDuplicates:!0,casePermute:!1,minPasswordLen:1,maxPasswordLen:8,minElemInChain:1,maxElemInChain:8,optimized:!0,startNow:!0,endNever:!0,timeForJob:void 0,deviceTypes:0,workloadProfile:0,slowCandidates:!1,extraHcArgs:"",fixedWorkunitSize:0,lookupKnownHashes:!0};var Ce={namespaced:!0,state:m(m({},C),v),getters:{attackSettings(e){const s=Ve.find(t=>t.handler===e.attackSettingsTab);return s?{attack_mode:s.id,attack_name:s.serverName,rules:e.rules.length>0?e.rules[0]:null,left_dictionaries:e.leftDicts,right_dictionaries:e.rightDicts,rule_left:e.ruleLeft,rule_right:e.ruleRight,masks:e.masks,attack_submode:e.submode,distribution_mode:parseInt(e.distributionMode),markov_treshold:e.submode==0?null:parseInt(e.markovThresh),markov:e.submode==0?null:e.markov[0],charset:e.charset,mask:e.hybridMask,pcfg_grammar:e.pcfg[0],keyspace_limit:e.keyspaceLimit,check_duplicates:e.checkDuplicates,case_permute:e.casePermute,min_password_len:parseInt(e.minPasswordLen),max_password_len:parseInt(e.maxPasswordLen),min_elem_in_chain:parseInt(e.minElemInChain),max_elem_in_chain:parseInt(e.maxElemInChain),dict_deployment_mode:parseInt(e.dictDeploymentMode),slow_candidates:e.slowCandidates}:!1},jobSettings(e,{attackSettings:s}){return{name:e.name,comment:e.comment,hosts_ids:e.hosts.map(t=>t.id),seconds_per_job:parseInt(e.timeForJob),time_start:e.startNow?"":e.startDate,time_end:e.endNever?"":e.endDate,attack_settings:s,hash_settings:{hash_type:e.hashType?e.hashType.code:null,hash_list:e.validatedHashes,valid_only:!e.ignoreHashes},device_types:parseInt(e.deviceTypes),workload_profile:parseInt(e.workloadProfile),priority:parseInt(e.priority),optimized:c.prototype.$optimizedOnly?!0:e.optimized,extra_hc_args:e.extraHcArgs,fixed_workunit_size:e.fixedWorkunitSize,lookup_known_hashes:e.lookupKnownHashes}},validAttackSpecificSettings(e){switch(e.attackSettingsTab){case"dictionary":return e.leftDicts.length>0;case"combinator":return e.leftDicts.length>0&&e.rightDicts.length>0;case"maskattack":return e.submode>0&&e.markov.length==0?!1:e.masks.filter(s=>s!=="").length>0;case"hybridWordlistMask":return e.leftDicts.length>0&&e.hybridMask!=="";case"hybridMaskWordlist":return e.rightDicts.length>0&&e.hybridMask!=="";case"pcfgAttack":return e.pcfg.length>0;case"princeAttack":return!(e.leftDicts.length==0||e.minPasswordLen<=0||e.maxPasswordLen<=0||e.maxPasswordLen>32||e.maxElemInChain>16||e.minElemInChain<=0||e.maxElemInChain<=0||e.minPasswordLen>e.maxPasswordLen||e.minElemInChain>e.maxElemInChain||e.maxElemInChain>e.maxPasswordLen||e.keyspaceLimit<0);default:return!0}},valid(e,{attackSettings:s,validAttackSpecificSettings:t}){return!e.attackSettingsTab||!s||e.hashType==null||e.validatedHashes.length==0||e.timeForJob<10||e.name===""?!1:t},keyspaceKnown({attackSettingsTab:e},{validAttackSpecificSettings:s}){return e&&s},template(e){const s=Object.keys(v);return Object.keys(e).filter(t=>s.includes(t)).reduce((t,r)=>((JSON.stringify(e[r])!==JSON.stringify(v[r])||r==="masks"&&e.masks[0]!=="")&&(t[r]=e[r]),t),{})},validTemplate(e,{template:s}){return Object.keys(s).length>0},makeTemplate(e,{template:s}){return function(t){const r=s;return r.template=t,r}}},mutations:b(m({},N(m(m({},C),v))),{update(e,s){Object.assign(e,s)},applyTemplate(e,s="{}"){Object.assign(e,m(m({},v),s))},addMask({masks:e},s=""){e.push(s)},deleteMask({masks:e},s){e.length<=1||e.splice(s,1)},updateMask({masks:e},{index:s,val:t}){c.set(e,s,t)},mergeMasks(e,s){e.masks=[...e.masks,...s],e.masks[0]==""&&e.masks.shift()}})};const Ve=[{handler:"dictionary",name:"Dictionary",id:0,serverName:"dict"},{handler:"combinator",name:"Combination",id:1,serverName:"combinator"},{handler:"maskattack",name:"Brute-force",id:3,serverName:"mask"},{handler:"hybridWordlistMask",name:"Hybrid Wordlist + Mask",id:6,serverName:"Hybrid wordlist+mask"},{handler:"hybridMaskWordlist",name:"Hybrid Mask + Wordlist",id:7,serverName:"Hybrid mask+wordlist"},{handler:"princeAttack",name:"PRINCE",id:8,serverName:"prince"},{handler:"pcfgAttack",name:"PCFG",id:9,serverName:"pcfg"}],_=window.serverAddress,V={loading:!1,clean:!0,bins:[],selectedJobs:[]};var Ne={namespaced:!0,state:V,getters:{},mutations:b(m({},N(V)),{loading(e){e.loading=!0},idle(e){e.loading=!1},dirty(e){e.clean=!1},clean(e){e.clean=!0},unselect(e){e.selectedJobs=[]},populate(e,s){e.bins=s},rename(e,{id:s,name:t}){e.bins.find(r=>r.id==s).name=t}}),actions:{async load({commit:e}){e("loading");const s=await d.get(`${_}/bins`).then(t=>t.data.items);e("idle"),e("populate",s)},async create({commit:e,dispatch:s},t){e("loading"),await d.post(`${_}/bins`,{name:t}),s("load")},move({commit:e,state:s},{id:t,position:r,oldIndex:n}){return e("loading"),d.patch(`${_}/bins/${t}/move`,{position:r}).catch(i=>{console.warn("Undoing move operation on bins");const o=s.bins,f=o[r];o.splice(r,1),o.splice(n,0,f),e("populate",o)}).finally(()=>{e("idle")})},async assign({commit:e,dispatch:s},{id:t,payload:r,dirty:n}){e("loading"),await d.put(`${_}/bins/${t}/assign`,r),e("unselect"),n&&e("dirty"),s("load")},async rename({commit:e},{id:s,newName:t}){e("loading");try{await d.patch(`${_}/bins/${s}`,{name:t}),e("rename",{id:s,name:t})}catch{console.error("Rename failed")}finally{e("idle")}},async delete({commit:e,dispatch:s,state:{bins:t}},r){e("loading"),await d.delete(`${_}/bins/${r}`);const n=t.map(i=>i.id).indexOf(r);n>0?h.replace({name:"bins",params:{id:t[n-1].id}}):h.replace({name:"jobs"}),s("load")}}},Me={namespaced:!0,state:{jobs:[]},getters:{job_ids:e=>e.jobs.map(s=>s.id)},mutations:{add(e,s){const t=s.filter(r=>!e.jobs.some(n=>r.id==n.id));e.jobs=e.jobs.concat(t)},remove(e,s){e.jobs=e.jobs.filter(t=>t.id!=s)},reset(e){e.jobs=[]}}};c.use(T);var w=new T.Store({state:{darkAppearance:!1,project:window.projectName||"Fitcrack"},modules:{user:Re,jobForm:Ce,binInterface:Ne,transfer:Me}});function ct(e){const s={};return e.forEach(t=>{s[t]=`${t}Mut`}),s}function N(e){const s=r=>(n,i)=>{n[r]=i},t={};return Object.keys(e).forEach(r=>{t[`${r}Mut`]=s(r)}),t}var Ue=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("v-dialog",{attrs:{"max-width":e.options.width},model:{value:e.dialog,callback:function(r){e.dialog=r},expression:"dialog"}},[t("v-card",{attrs:{flat:""}},[t("v-card-title",[e._v(" "+e._s(e.title)+" ")]),t("v-card-text",{directives:[{name:"show",rawName:"v-show",value:!!e.message,expression:"!!message"}]},[e._v(" "+e._s(e.message)+" ")]),t("v-card-actions",[t("v-spacer"),t("v-btn",{attrs:{text:""},nativeOn:{click:function(r){return e.cancel()}}},[e._v(" Cancel ")]),t("v-btn",{attrs:{color:"primary",outlined:"",text:""},nativeOn:{click:function(r){return e.agree()}}},[t("v-icon",{attrs:{left:""}},[e._v(" mdi-keyboard-return ")]),e._v(" Yes ")],1)],1)],1)],1)},He=[];function E(e,s,t,r,n,i,o,f){var l=typeof e=="function"?e.options:e;s&&(l.render=s,l.staticRenderFns=t,l._compiled=!0),r&&(l.functional=!0),i&&(l._scopeId="data-v-"+i);var p;if(o?(p=function(u){u=u||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!u&&typeof __VUE_SSR_CONTEXT__!="undefined"&&(u=__VUE_SSR_CONTEXT__),n&&n.call(this,u),u&&u._registeredComponents&&u._registeredComponents.add(o)},l._ssrRegister=p):n&&(p=f?function(){n.call(this,(l.functional?this.parent:this).$root.$options.shadowRoot)}:n),p)if(l.functional){l._injectStyles=p;var J=l.render;l.render=function(F,D){return p.call(D),J(F,D)}}else{var I=l.beforeCreate;l.beforeCreate=I?[].concat(I,p):[p]}return{exports:e,options:l}}const Je={data(){return{dialog:!1,resolve:null,reject:null,message:null,title:null,options:{color:"primary",width:290}}},mounted(){window.addEventListener("keydown",this.shortcutHandler)},beforeDestroy(){window.removeEventListener("keydown",this.shortcutHandler)},methods:{open(e,s,t){return this.dialog=!0,this.title=e,this.message=s,this.options=Object.assign(this.options,t),new Promise((r,n)=>{this.resolve=r,this.reject=n})},agree(){this.resolve(!0),this.reject(!1),this.dialog=!1},cancel(){this.dialog=!1},shortcutHandler(e){switch(e.key){case"Escape":this.reject&&this.cancel();break;case"Enter":this.resolve&&this.agree();break;default:return}}}},M={};var Fe=E(Je,Ue,He,!1,Be,null,null,null);function Be(e){for(let s in M)this[s]=M[s]}var We=function(){return Fe.exports}(),ze=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("v-dialog",{attrs:{"max-width":"550",persistent:""},model:{value:e.visible,callback:function(r){e.visible=r},expression:"visible"}},[t("v-card",[t("v-card-title",[e._v(" API Server "+e._s(e.retries>5?"Really ":"")+"Unreachable ")]),t("v-card-subtitle",[e._v(" "+e._s(e.addr)+" ")]),t("v-card-text",[e.retries<=5?t("span",[e._v(" We'll keep trying to connect in case it hasn't started yet. ")]):t("span",[e._v(" Tried "+e._s(e.retries)+" times and still nothing. "),e.retries>=15?t("span",[e._v(" Sorry, but at this point, it's pretty clear you'll need to fix it manually.")]):e._e(),e.retries>=20?t("span",[e._v(" Seriously, it won't just magically start working.")]):e._e(),e.retries>=30?t("span",[e._v(" We're getting nowhere like this. Just follow the "),t("strong",[e._v("Help button")]),e._v(" below, please?")]):e._e(),e.retries>=50?t("span",[t("br"),t("br"),e._v("You're enjoying this, aren't you?")]):e._e(),e.retries>=60?t("span",[e._v(" It's kind of awkward, not gonna lie.")]):e._e(),e.retries>=70?t("span",[e._v(" You do realize that this is just an error message, right?")]):e._e(),e.retries>=100?t("span",[t("br"),t("br"),e._v("OK, it's your free time, not ours. Let's humor you some more, then.")]):e._e()]),t("v-progress-linear",{staticClass:"mt-3",attrs:{indeterminate:"",color:e.statusColor}})],1),t("v-card-text",{staticClass:"py-0"},[e.retries<=0?t("v-alert",{attrs:{type:"info"}},[e._v(" Hang tight! Reconnecting in a few. ")]):e.retries<=5?t("v-alert",{attrs:{type:"error",color:e.statusColor}},[e._v(" "+e._s(e.retries)+" failed reconnection attempt"+e._s(e.retries>1?"s":"")+" ")]):e.retries<100?t("v-alert",{attrs:{type:"error",icon:"mdi-emoticon-dead"}},[e._v(" Yeah, still no connection. Try "),t("strong",[e._v("Help")]),e._v(" below. ")]):t("v-alert",{attrs:{type:"success",icon:"mdi-trophy"}},[e._v(" Yay, "),t("strong",[e._v("Achievement Unlocked!")]),e._v(" Retried "+e._s(Math.floor(e.retries/10)*10)+" times. ")])],1),t("v-card-actions",[t("v-spacer"),t("v-btn",{attrs:{text:"",color:e.retries>=3?e.statusColor:""},on:{click:e.showSuggestions}},[e._v(" Help ")]),t("v-btn",{on:{click:e.retry}},[e._v(" Retry Now ")])],1)],1),t("v-bottom-sheet",{attrs:{"overlay-color":"secondary","overlay-opacity":"0.3",dark:""},model:{value:e.help,callback:function(r){e.help=r},expression:"help"}},[t("v-card",{attrs:{tile:"","min-width":"100vw"}},[t("v-card-title",[t("v-icon",{attrs:{left:""}},[e._v("mdi-bandage")]),e._v(" Here's what you can try "),t("v-spacer"),t("v-card-actions",[t("v-btn",{attrs:{text:"",to:"//github.com/nesfit/fitcrack/issues",target:"_blank"}},[t("v-icon",{attrs:{left:""}},[e._v("mdi-github")]),e._v(" Ask on Github ")],1),t("v-btn",{attrs:{color:"success"},on:{click:e.hideSuggestions}},[t("v-icon",{attrs:{left:""}},[e._v("mdi-check")]),e._v(" Done ")],1)],1)],1),t("v-card-text",[t("v-expansion-panels",{attrs:{multiple:"",light:""},model:{value:e.suggestionsShown,callback:function(r){e.suggestionsShown=r},expression:"suggestionsShown"}},[t("v-expansion-panel",[t("v-expansion-panel-header",[t("span",[t("v-icon",{staticClass:"pb-1",attrs:{left:"",small:""}},[e._v("mdi-ethernet")]),t("span",{staticClass:"text-subtitle-1"},[e._v("Check network connection")])],1)]),t("v-expansion-panel-content",{staticClass:"limit-width"},[e._v(" Are you connected to the right network? Your Fitcrack API server might be exposed to a different network, or your internet connection maybe isn't working right and the app loaded out of cache. "),t("ul",[t("li",[e._v("Check your internet connection")]),t("li",[e._v("Check where you are \u2013 do you need a VPN to connect to Fitcrack?")]),t("li",[e._v("If you are on the same network as the server, try to ping it")])])])],1),t("v-expansion-panel",[t("v-expansion-panel-header",[t("span",[t("v-icon",{staticClass:"pb-1",attrs:{left:"",small:""}},[e._v("mdi-wrench")]),t("span",{staticClass:"text-subtitle-1"},[e._v("Check client configuration")])],1)]),t("v-expansion-panel-content",{staticClass:"limit-width"},[e._v(" The webadmin app is configured to connect to the API on a specific address. Check if it hasn't changed server-side, or if it was configured correctly in the first place. "),t("ul",[t("li",[e._v("Check if "),t("code",[e._v("window.serverAddress")]),e._v(" in the "),t("code",[e._v("/public/static/configuration.js")]),e._v(" file of FitcrackFE has the correct address")]),t("li",[e._v("Double-check the server's current address!")])])])],1),t("v-expansion-panel",[t("v-expansion-panel-header",[t("span",[t("v-icon",{staticClass:"pb-1",attrs:{left:"",small:""}},[e._v("mdi-server")]),t("span",{staticClass:"text-subtitle-1"},[e._v("Check server status")])],1)]),t("v-expansion-panel-content",{staticClass:"limit-width"},[e._v(" The API server could be offline or malfunctoining. You could try to restart the Fitcrack service. "),t("ul",[t("li",[e._v("Access the server shell and check if the service is enabled with "),t("code",[e._v("service fitcrack status")])]),t("li",[e._v("Try to start it up if needed with "),t("code",[e._v("service fitcrack start")])])])])],1)],1)],1)],1)],1)],1)},Ke=[];const Ge={props:{visible:Boolean},data(){return{interval:null,retries:0,help:!1,suggestionsShown:[0]}},computed:{addr(){return window.serverAddress},statusColor(){return this.retries==0?"blue":this.retries<=5?"orange":this.retries<100?"red":"green"}},methods:{showSuggestions(){this.help=!0},hideSuggestions(){this.help=!1},async retry(){this.retries+=1,await w.dispatch("refreshUser")&&this.$emit("connect")}},watch:{visible(e){e==!0?(this.retries=0,setTimeout(this.retry,2e3),this.interval=setInterval(this.retry,5e3)):clearInterval(this.interval)}}},U={};var Ye=E(Ge,ze,Ke,!1,qe,"85937c20",null,null);function qe(e){for(let s in U)this[s]=U[s]}var Xe=function(){return Ye.exports}(),Qe=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("v-app",[t("Connection",{attrs:{visible:e.connectionAssistant},on:{connect:e.handleReconnection}}),t("v-snackbar",{staticClass:"errorSnackbar pa-0",attrs:{timeout:6e3,bottom:"",right:"",color:"transparent"},model:{value:e.alert,callback:function(r){e.alert=r},expression:"alert"}},[t("v-alert",{staticClass:"height100 ma-0 width100",attrs:{type:e.alertType,value:!0,dismissible:"",transition:"none"},model:{value:e.alert,callback:function(r){e.alert=r},expression:"alert"}},[e._v(" "+e._s(e.alertText)+" ")])],1),t("router-view",{attrs:{"is-dark":e.isDark},on:{alert:e.setAlert}}),t("confirm",{ref:"confirm"})],1)},Ze=[];const et={name:"App",components:{confirm:We,Connection:Xe},data:function(){return{alert:!1,alertText:"",alertType:"error",isDark:!1,connectionAssistant:!1}},created:function(){this.axios.interceptors.request.use(function(t){const r=localStorage.getItem("jwt");return r&&r!==""&&(t.headers.common.Authorization=`Bearer ${r}`),t}.bind(this),function(t){return Promise.reject(t)}.bind(this)),this.axios.interceptors.response.use(function(t){return t.data.hasOwnProperty("hideAlert")&&t.data.hideAlert&&(this.alert=!1),t.data.hasOwnProperty("status")&&t.data.hasOwnProperty("message")&&t.data.status&&(this.alertType="success",this.alert=!0,this.alertText=t.data.message),t}.bind(this),function(t){if(this.alertType="error",this.alert=!0,t.response!==void 0)if(t.response.data.message==="Input payload validation failed"){let r=Object.keys(t.response.data.errors)[0];this.alertText="Wrong settings. "+r+" ("+t.response.data.errors[r]+")"}else this.alertText=t.response.data.message;else t.message!==void 0?t.message==="Network Error"?(this.alert=!1,this.connectionAssistant=!0):this.alertText=t.message:this.alertText="Can not connect to "+this.$serverAddr;return Promise.reject(t)}.bind(this));const e=window.matchMedia("(prefers-color-scheme: dark)");e.addListener(t=>{const r=localStorage.getItem("appearance");(!r||r=="auto")&&(this.$vuetify.theme.dark=t.matches)});const s=localStorage.getItem("appearance");s&&s=="dark"?this.$vuetify.theme.dark=!0:(!s||s=="auto")&&(this.$vuetify.theme.dark=e.matches),window.addEventListener("keypress",t=>{localStorage.getItem("testmode")=="true"&&t.ctrlKey&&t.shiftKey&&t.code=="KeyL"&&(this.$vuetify.theme.dark=!this.$vuetify.theme.dark)})},mounted(){this.$root.$confirm=this.$refs.confirm.open},methods:{setAlert({type:e,text:s}){this.alertType=e,this.alertText=s,this.alert=!0},handleReconnection(){this.connectionAssistant=!1,this.$router.go()}}},H={};var tt=E(et,Qe,Ze,!1,st,"64a0d094",null,null);function st(e){for(let s in H)this[s]=H[s]}var rt=function(){return tt.exports}();const nt={install(e){e.prototype.$logoutUser=function(){this.$store.state.user={userData:{id:null,username:null,mail:null,role:{MANAGE_USERS:!1,ADD_NEW_JOB:!1,UPLOAD_DICTIONARIES:!1,VIEW_ALL_JOBS:!1,EDIT_ALL_JOBS:!1,OPERATE_ALL_JOBS:!1,ADD_USER_PERMISSIONS_TO_JOB:!1}},loggedIn:!1},console.log("logged OUT!!!"),this.$router.push({name:"login"})},e.prototype.$logInUser=function(s){this.$store.state.user.userData=s,this.$store.state.user.loggedIn=!0,console.log("logged IN!!!");const t=sessionStorage.getItem("loginRedirect");sessionStorage.removeItem("loginRedirect"),!t||t==="/login"?this.$router.replace({name:"home"}):this.$router.replace(t)},e.prototype.$currentUser=function(){return this.axios.get(this.$serverAddr+"/user/isLoggedIn").then(s=>s.data)},e.prototype.$needLogin=!0,e.prototype.$serverAddr=window.serverAddress,e.prototype.$docsLink=window.docsLink,e.prototype.$optimizedOnly=window.optimizedKernelsOnly,e.prototype.$user=function(){return this.user},e.prototype.$username=this.name,e.prototype.$userCan=function(s){return this.$store.state.user.userData.role[s]},e.prototype.$error=function(s){this.axios.interceptors.response.handlers["0"].rejected({message:s})},e.prototype.$success=function(s){this.axios.interceptors.response.handlers["0"].fulfilled({data:{status:!0,message:s}})},e.prototype.$hideAlert=function(){this.axios.interceptors.response.handlers["0"].fulfilled({data:{hideAlert:!0}})}}},g="fitcrack-pagination-store";var at={install(e){localStorage.getItem(g)||localStorage.setItem(g,"{}"),e.prototype.$paginator=function(s,t){const r=JSON.parse(localStorage.getItem(g));return t===void 0?r[s]||1:(t===null?delete r[s]:r[s]=t,localStorage.setItem(g,JSON.stringify(r)),r[s])}}};Y.register(...q);document.title=window.projectName||"Fitcrack";X(L);c.use(Q);c.use(Z);c.use(ee,{moment:L});c.use(te,d);c.axios.defaults.withCredentials=!0;c.use($);c.use(nt);c.use(at);new c({el:"#app",router:h,store:w,vuetify:new $({icons:{iconfont:"mdi"},theme:{dark:!1,themes:window.theme}}),render:e=>e(rt)}).$mount("#app");export{Ve as a,E as n,lt as r,w as s,ct as t};
