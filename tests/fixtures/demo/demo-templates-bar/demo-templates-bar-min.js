YUI.add("demo-templates-bar",function(e,t){var n=e.Template.Handlebars.revive(function(e,t,n,r,i){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{};var s="",o,u="function",a=this.escapeExpression;return s+="<p>Handlebars template body content: ",(o=n.tellme)?o=o.call(t,{hash:{},data:i}):(o=t.tellme,o=typeof o===u?o.apply(t):o),s+=a(o)+"</p>\n",s}),r=e.Template._cache=e.Template._cache||{},i={};e.Array.each([],function(e){r["demo/"+e]&&(i[e]=r["demo/"+e])}),r["demo/bar"]=function(e){return n(e,{partials:i})}},"@VERSION@",{requires:["handlebars-base"]});
