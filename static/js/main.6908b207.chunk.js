(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{47:function(e,a,t){e.exports=t(56)},52:function(e,a,t){},56:function(e,a,t){"use strict";t.r(a);var o=t(0),n=t.n(o),r=t(9),l=t.n(r),c=(t(52),t(40)),i=t(94),s=t(19),m=t(25),u=t(32),g=t(91),d=t(95),h=t(97),E=t(96),O=t(88),b=t(93),p=t(23),f=t.n(p),v=Object(O.a)({title:{backgroundColor:f.a[900],color:"white",display:"flex"},textBox:{backgroundColor:f.a[800],color:"white",display:"flex",justifyContent:"space-between"},submitBtns:{backgroundColor:f.a[700],color:"white"}});var C=function(){var e=v(),a={address:"https://10.10.16.122:3000",maxResult:500,minWord:2,delay:500,timeout:5e3},t=Object(o.useState)(a),r=Object(u.a)(t,2),l=r[0],c=r[1],i=Object(o.useState)(""),O=Object(u.a)(i,2),p=O[0],f=O[1];console.log("re-rendering!!");var C=l.address,S=l.maxResult,x=l.minWord,B=l.delay,_=l.timeout;console.log(C,S,x,B,_);var w=new Map;chrome.storage||(chrome.storage={local:w}),Object(o.useEffect)((function(){console.log("in useEffect"),chrome.storage.local.get("MBK_SEARCH_OPTIONS",(function(e){console.log("result = ",e),console.log("result[LOCAL_STORAGE_KEY] = ",e.MBK_SEARCH_OPTIONS);var t=e.MBK_SEARCH_OPTIONS,o=Object.assign({},a,t);c(Object(m.a)({},o)),chrome.storage.local.set(Object(s.a)({},"MBK_SEARCH_OPTIONS",o),(function(){console.log("save localStorage[".concat("MBK_SEARCH_OPTIONS","] = "),o),console.log(chrome.runtime.lastError)}))}))}),[]);var j=function(e){return function(a){var t=a.target.value,o=Object(m.a)({},l,Object(s.a)({},e,t));c(o)}};return n.a.createElement(g.a,{maxWidth:"sm"},n.a.createElement(E.a,{p:1,className:e.title},n.a.createElement(b.a,{variant:"h4"},"\uc635\uc158"),n.a.createElement(h.a,{style:{marginLeft:"auto"},variant:"contained",onClick:function(){c(Object(m.a)({},a)),chrome.storage.local.set(Object(s.a)({},"MBK_SEARCH_OPTIONS",Object(m.a)({},a)),(function(){console.log("save localStorage[".concat("MBK_SEARCH_OPTIONS","] = "),l),console.log(chrome.runtime.lastError),f("\ucd08\uae30\ud654\ub418\uc5c8\uc2b5\ub2c8\ub2e4.")}))}},"\ucd08\uae30\ud654")),n.a.createElement(E.a,{p:1,className:e.textBox},n.a.createElement(d.a,{autoFocus:!0,value:C,margin:"dense",onChange:j("address"),required:!0,fullWidth:!0,label:"\uc8fc\uc18c"})),n.a.createElement(E.a,{p:1,className:e.textBox},n.a.createElement(d.a,{value:S,margin:"dense",onChange:j("maxResult"),label:"\ucd5c\ub300 \uacb0\uacfc\uac2f\uc218"}),n.a.createElement(d.a,{value:x,margin:"dense",onChange:j("minWord"),label:"\ucd5c\uc18c \uac80\uc0c9\ub2e8\uc5b4\uc218"})),n.a.createElement(E.a,{p:1,className:e.textBox},n.a.createElement(d.a,{value:B,margin:"dense",onChange:j("delay"),label:"\uc790\ub3d9\uc644\uc131 \uc9c0\uc5f0(ms)"}),n.a.createElement(d.a,{value:_,margin:"dense",onChange:j("timeout"),label:"\uc790\ub3d9\uc644\uc131 \uc2dc\uac04\ucd08\uacfc(ms)"})),n.a.createElement(E.a,{p:1,className:e.submitBtns},n.a.createElement(h.a,{variant:"contained",onClick:function(){console.log(chrome),chrome.storage.local.set(Object(s.a)({},"MBK_SEARCH_OPTIONS",l),(function(){console.log("save localStorage[".concat("MBK_SEARCH_OPTIONS","] = "),l),console.log(chrome.runtime.lastError),f("\uc800\uc7a5\ub418\uc5c8\uc2b5\ub2c8\ub2e4.")}))}},"\uc800\uc7a5"),n.a.createElement(h.a,{style:{marginLeft:"5px"},variant:"contained",onClick:function(){window.close()}},"\ub2eb\uae30"),n.a.createElement(b.a,{style:{marginLeft:"20px"},variant:"caption"},p)))};var S=function(){var e=Object(c.a)({palette:{type:"light"},overrides:{MuiContainer:{root:{width:"500px",paddingLeft:"0px",paddingRight:"0px"}},MuiFormLabel:{root:{color:"white","&$focused":{color:"grey"}}},MuiInputBase:{root:{color:"white"}},MuiButton:{contained:{backgroundColor:f.a[800],color:"white"}},MuiInput:{underline:{"&:after":{borderBottom:"2px solid black"}}}}});return n.a.createElement(i.a,{theme:e},n.a.createElement(C,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(n.a.createElement(S,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[47,1,2]]]);
//# sourceMappingURL=main.6908b207.chunk.js.map