(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{53:function(e,a,t){e.exports=t(62)},58:function(e,a,t){},62:function(e,a,t){"use strict";t.r(a);var o=t(0),n=t.n(o),r=t(9),c=t.n(r),l=(t(58),t(44)),i=t(102),s=t(22),m=t(28),u=t(36),d=t(98),g=t(103),h=t(105),p=t(101),b=t(104),E=t(95),O=t(100),f=t(23),v=t.n(f),C=Object(E.a)({title:{backgroundColor:v.a[900],color:"white",display:"flex"},textBox:{backgroundColor:v.a[800],color:"white",display:"flex",justifyContent:"space-between"},submitBtns:{backgroundColor:v.a[700],color:"white"},checkSupportThree:{backgroundColor:v.a[800],display:"flex",alignContent:"center"}});var S=function(){var e=C(),a={address:"https://10.10.16.122:3000",maxResult:500,minWord:2,delay:500,timeout:5e3,supportThreeWords:!0},t=Object(o.useState)(a),r=Object(u.a)(t,2),c=r[0],l=r[1],i=Object(o.useState)(""),E=Object(u.a)(i,2),f=E[0],v=E[1];console.log("re-rendering!!");var S=c.address,x=c.maxResult,w=c.minWord,y=c.delay,k=c.timeout,B=c.supportThreeWords;console.log(S,x,w,y,k,B);var _=new Map;chrome.storage||(chrome.storage={local:_}),Object(o.useEffect)((function(){console.log("in useEffect"),chrome.storage.local.get("MBK_SEARCH_OPTIONS",(function(e){console.log("result = ",e),console.log("result[LOCAL_STORAGE_KEY] = ",e.MBK_SEARCH_OPTIONS);var t=e.MBK_SEARCH_OPTIONS,o=Object.assign({},a,t);l(Object(m.a)({},o)),chrome.storage.local.set(Object(s.a)({},"MBK_SEARCH_OPTIONS",o),(function(){console.log("save localStorage[".concat("MBK_SEARCH_OPTIONS","] = "),o),console.log(chrome.runtime.lastError)}))}))}),[]);var j=function(e){return function(a){var t=a.target.value,o=Object(m.a)({},c,Object(s.a)({},e,t));l(o)}};return n.a.createElement(d.a,{maxWidth:"sm"},n.a.createElement(b.a,{p:1,className:e.title},n.a.createElement(O.a,{variant:"h4"},"\uc635\uc158"),n.a.createElement(p.a,{style:{marginLeft:"auto"},variant:"contained",onClick:function(){l(Object(m.a)({},a)),chrome.storage.local.set(Object(s.a)({},"MBK_SEARCH_OPTIONS",Object(m.a)({},a)),(function(){console.log("save localStorage[".concat("MBK_SEARCH_OPTIONS","] = "),c),console.log(chrome.runtime.lastError),v("\ucd08\uae30\ud654\ub418\uc5c8\uc2b5\ub2c8\ub2e4.")}))}},"\ucd08\uae30\ud654")),n.a.createElement(b.a,{p:1,className:e.textBox},n.a.createElement(g.a,{autoFocus:!0,value:S,margin:"dense",onChange:j("address"),required:!0,fullWidth:!0,label:"\uc8fc\uc18c"})),n.a.createElement(b.a,{p:1,className:e.textBox},n.a.createElement(g.a,{value:x,margin:"dense",onChange:j("maxResult"),label:"\ucd5c\ub300 \uacb0\uacfc\uac2f\uc218"}),n.a.createElement(g.a,{value:w,margin:"dense",onChange:j("minWord"),label:"\ucd5c\uc18c \uac80\uc0c9\ub2e8\uc5b4\uc218"})),n.a.createElement(b.a,{p:1,className:e.textBox},n.a.createElement(g.a,{value:y,margin:"dense",onChange:j("delay"),label:"\uc790\ub3d9\uc644\uc131 \uc9c0\uc5f0(ms)"}),n.a.createElement(g.a,{value:k,margin:"dense",onChange:j("timeout"),label:"\uc790\ub3d9\uc644\uc131 \uc2dc\uac04\ucd08\uacfc(ms)"})),n.a.createElement(b.a,{p:1,className:e.checkSupportThree},n.a.createElement(h.a,{checked:B,onChange:function(e){console.log(e.target.checked);var a=Object(m.a)({},c,{supportThreeWords:!B});l(a)},color:"primary",inputProps:{"aria-label":"primary checkbox"}}),n.a.createElement(O.a,{style:{margin:"0.8em",color:"white"},variant:"body2"},"\uc138\ub2e8\uc5b4 \uc774\uc0c1 \uac80\uc0c9 \ud65c\uc131\ud654")),n.a.createElement(b.a,{p:1,className:e.submitBtns},n.a.createElement(p.a,{variant:"contained",onClick:function(){console.log(chrome),chrome.storage.local.set(Object(s.a)({},"MBK_SEARCH_OPTIONS",c),(function(){console.log("save localStorage[".concat("MBK_SEARCH_OPTIONS","] = "),c),console.log(chrome.runtime.lastError),v("\uc800\uc7a5\ub418\uc5c8\uc2b5\ub2c8\ub2e4.")}))}},"\uc800\uc7a5"),n.a.createElement(p.a,{style:{marginLeft:"5px"},variant:"contained",onClick:function(){window.close()}},"\ub2eb\uae30"),n.a.createElement(O.a,{style:{marginLeft:"20px"},variant:"caption"},f)))};var x=function(){var e=Object(l.a)({palette:{type:"light"},overrides:{MuiContainer:{root:{width:"500px",paddingLeft:"0px",paddingRight:"0px"}},MuiFormLabel:{root:{color:"white","&$focused":{color:"grey"}}},MuiInputBase:{root:{color:"white"}},MuiButton:{contained:{backgroundColor:v.a[800],color:"white"}},MuiInput:{underline:{"&:after":{borderBottom:"2px solid black"}}},MuiCheckbox:{colorPrimary:{color:"white","&$checked":{color:"white"}}}}});return n.a.createElement(i.a,{theme:e},n.a.createElement(S,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(n.a.createElement(x,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[53,1,2]]]);
//# sourceMappingURL=main.90e289ea.chunk.js.map