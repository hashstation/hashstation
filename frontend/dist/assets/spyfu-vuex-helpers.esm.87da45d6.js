function i(r,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:".",n=Array.isArray(t)?t:t.split(e);return n.reduce(function(a,s){return a&&a[s]},r)}function u(r){for(var t=arguments.length,e=Array(t>1?t-1:0),n=1;n<t;n++)e[n-1]=arguments[n];throw new(Function.prototype.bind.apply(Error,[null].concat(["[spyfu-vuex-helpers]: "+r],e)))}function f(){var r=o(arguments),t=r.namespace,e=r.mappings,n=m(e),a={};return Object.keys(n).forEach(function(s){a[s]={get:p(t,n[s]),set:c(t,n[s])}}),a}function o(r){var t=r[0],e=r[1];return typeof t=="string"?{namespace:t,mappings:e}:{namespace:null,mappings:t}}function m(r){var t={};return Array.isArray(r)&&u("Invalid arguments for mapTwoWayState. State mapping must be an object in { 'path.to.state': 'mutationName' } format."),Object.keys(r).forEach(function(e){var n=r[e],a=e.slice(e.lastIndexOf(".")+1);typeof n=="string"?t[a]={key:e,mutation:n}:t[a]={key:n.key,mutation:n.mutation}}),t}function p(r,t){return r?function(){var e=i(this.$store.state,r,"/");return i(e,t.key,".")}:function(){return i(this.$store.state,t.key,".")}}function c(r,t){var e=t.mutation;return r&&(e=r+"/"+e),function(n){this.$store.commit(e,n)}}export{f as m};
