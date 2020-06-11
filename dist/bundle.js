!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.parseSRT=t()}(this,(function(){"use strict";function e(e){var t=e.split(":");try{var n=t[2].split(",");return 1===n.length&&(n=t[2].split(".")),3600*parseFloat(t[0],10)+60*parseFloat(t[1],10)+parseFloat(n[0],10)+parseFloat(n[1],10)/1e3}catch(e){return 0}}function t(e,t){for(var n=t;!e[n];)n++;return n}function n(e){for(var t=e.length-1;t>=0&&!e[t];)t--;return t}return function(){for(var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",o=[],i=r.split(/(?:\r\n|\r|\n)/gm),a=n(i)+1,s=0,l=void 0,p=void 0,u=void 0,c=0;c<a;c++){for(u={},p=[],c=t(i,c),u.id=parseInt(i[c++],10),l=i[c++].split(/[\t ]*-->[\t ]*/),u.start=e(l[0]),-1!==(s=l[1].indexOf(" "))&&(l[1]=l[1].substr(0,s)),u.end=e(l[1]);c<a&&i[c];)p.push(i[c++]);u.text=p.join("\\N").replace(/\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi,""),u.text=u.text.replace(/</g,"&lt;").replace(/>/g,"&gt;"),u.text=u.text.replace(/&lt;(\/?(font|b|u|i|s))((\s+(\w|\w[\w\-]*\w)(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)(\/?)&gt;/gi,"<$1$3$7>"),u.text=u.text.replace(/\\N/gi,"<br />"),o.push(u)}return o}})),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Mustache=t()}(this,(function(){"use strict";var e=Object.prototype.toString,t=Array.isArray||function(t){return"[object Array]"===e.call(t)};function n(e){return"function"==typeof e}function r(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function o(e,t){return null!=e&&"object"==typeof e&&t in e}var i=RegExp.prototype.test;var a=/\S/;function s(e){return!function(e,t){return i.call(e,t)}(a,e)}var l={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};var p=/\s*/,u=/\s+/,c=/\s*=/,h=/\s*\}/,f=/#|\^|\/|>|\{|&|=|!/;function d(e){this.string=e,this.tail=e,this.pos=0}function g(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function v(){this.templateCache={_cache:{},set:function(e,t){this._cache[e]=t},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}d.prototype.eos=function(){return""===this.tail},d.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},d.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},g.prototype.push=function(e){return new g(e,this)},g.prototype.lookup=function(e){var t,r,i,a=this.cache;if(a.hasOwnProperty(e))t=a[e];else{for(var s,l,p,u=this,c=!1;u;){if(e.indexOf(".")>0)for(s=u.view,l=e.split("."),p=0;null!=s&&p<l.length;)p===l.length-1&&(c=o(s,l[p])||(r=s,i=l[p],null!=r&&"object"!=typeof r&&r.hasOwnProperty&&r.hasOwnProperty(i))),s=s[l[p++]];else s=u.view[e],c=o(u.view,e);if(c){t=s;break}u=u.parent}a[e]=t}return n(t)&&(t=t.call(this.view)),t},v.prototype.clearCache=function(){void 0!==this.templateCache&&this.templateCache.clear()},v.prototype.parse=function(e,n){var o=this.templateCache,i=e+":"+(n||m.tags).join(":"),a=void 0!==o,l=a?o.get(i):void 0;return null==l&&(l=function(e,n){if(!e)return[];var o,i,a,l=!1,g=[],v=[],w=[],y=!1,x=!1,b="",C=0;function k(){if(y&&!x)for(;w.length;)delete v[w.pop()];else w=[];y=!1,x=!1}function E(e){if("string"==typeof e&&(e=e.split(u,2)),!t(e)||2!==e.length)throw new Error("Invalid tags: "+e);o=new RegExp(r(e[0])+"\\s*"),i=new RegExp("\\s*"+r(e[1])),a=new RegExp("\\s*"+r("}"+e[1]))}E(n||m.tags);for(var T,L,S,U,O,P,V=new d(e);!V.eos();){if(T=V.pos,S=V.scanUntil(o))for(var j=0,D=S.length;j<D;++j)s(U=S.charAt(j))?(w.push(v.length),b+=U):(x=!0,l=!0,b+=" "),v.push(["text",U,T,T+1]),T+=1,"\n"===U&&(k(),b="",C=0,l=!1);if(!V.scan(o))break;if(y=!0,L=V.scan(f)||"name",V.scan(p),"="===L?(S=V.scanUntil(c),V.scan(c),V.scanUntil(i)):"{"===L?(S=V.scanUntil(a),V.scan(h),V.scanUntil(i),L="&"):S=V.scanUntil(i),!V.scan(i))throw new Error("Unclosed tag at "+V.pos);if(O=">"==L?[L,S,T,V.pos,b,C,l]:[L,S,T,V.pos],C++,v.push(O),"#"===L||"^"===L)g.push(O);else if("/"===L){if(!(P=g.pop()))throw new Error('Unopened section "'+S+'" at '+T);if(P[1]!==S)throw new Error('Unclosed section "'+P[1]+'" at '+T)}else"name"===L||"{"===L||"&"===L?x=!0:"="===L&&E(S)}if(k(),P=g.pop())throw new Error('Unclosed section "'+P[1]+'" at '+V.pos);return function(e){for(var t,n=[],r=n,o=[],i=0,a=e.length;i<a;++i)switch((t=e[i])[0]){case"#":case"^":r.push(t),o.push(t),r=t[4]=[];break;case"/":o.pop()[5]=t[2],r=o.length>0?o[o.length-1][4]:n;break;default:r.push(t)}return n}(function(e){for(var t,n,r=[],o=0,i=e.length;o<i;++o)(t=e[o])&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(r.push(t),n=t));return r}(v))}(e,n),a&&o.set(i,l)),l},v.prototype.render=function(e,t,n,r){var o=this.parse(e,r),i=t instanceof g?t:new g(t,void 0);return this.renderTokens(o,i,n,e,r)},v.prototype.renderTokens=function(e,t,n,r,o){for(var i,a,s,l="",p=0,u=e.length;p<u;++p)s=void 0,"#"===(a=(i=e[p])[0])?s=this.renderSection(i,t,n,r):"^"===a?s=this.renderInverted(i,t,n,r):">"===a?s=this.renderPartial(i,t,n,o):"&"===a?s=this.unescapedValue(i,t):"name"===a?s=this.escapedValue(i,t):"text"===a&&(s=this.rawValue(i)),void 0!==s&&(l+=s);return l},v.prototype.renderSection=function(e,r,o,i){var a=this,s="",l=r.lookup(e[1]);if(l){if(t(l))for(var p=0,u=l.length;p<u;++p)s+=this.renderTokens(e[4],r.push(l[p]),o,i);else if("object"==typeof l||"string"==typeof l||"number"==typeof l)s+=this.renderTokens(e[4],r.push(l),o,i);else if(n(l)){if("string"!=typeof i)throw new Error("Cannot use higher-order sections without the original template");null!=(l=l.call(r.view,i.slice(e[3],e[5]),(function(e){return a.render(e,r,o)})))&&(s+=l)}else s+=this.renderTokens(e[4],r,o,i);return s}},v.prototype.renderInverted=function(e,n,r,o){var i=n.lookup(e[1]);if(!i||t(i)&&0===i.length)return this.renderTokens(e[4],n,r,o)},v.prototype.indentPartial=function(e,t,n){for(var r=t.replace(/[^ \t]/g,""),o=e.split("\n"),i=0;i<o.length;i++)o[i].length&&(i>0||!n)&&(o[i]=r+o[i]);return o.join("\n")},v.prototype.renderPartial=function(e,t,r,o){if(r){var i=n(r)?r(e[1]):r[e[1]];if(null!=i){var a=e[6],s=e[5],l=e[4],p=i;return 0==s&&l&&(p=this.indentPartial(i,l,a)),this.renderTokens(this.parse(p,o),t,r,p,o)}}},v.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return n},v.prototype.escapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return m.escape(n)},v.prototype.rawValue=function(e){return e[1]};var m={name:"mustache.js",version:"4.0.1",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(e){w.templateCache=e},get templateCache(){return w.templateCache}},w=new v;return m.clearCache=function(){return w.clearCache()},m.parse=function(e,t){return w.parse(e,t)},m.render=function(e,n,r,o){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+((t(i=e)?"array":typeof i)+'" was given as the first argument for mustache#render(template, view, partials)'));var i;return w.render(e,n,r,o)},m.escape=function(e){return String(e).replace(/[&<>"'`=\/]/g,(function(e){return l[e]}))},m.Scanner=d,m.Context=g,m.Writer=v,m}));let globalSubs=null;const template=document.getElementById("template").innerHTML,handleFileDrop=function(e){const t=new FileReader;t.onload=function(){const e=t.result;globalSubs=e;const n=checkSubtitles(e);rendered=Mustache.render(template,n),document.getElementById("result").innerHTML=rendered;const r=document.getElementsByClassName("subheading");for(let e=0;e<r.length;e++)r[e].addEventListener("click",(function(t){t.target==r[e]?t.target.classList.toggle("open"):t.target.parentNode.classList.toggle("open")}))},t.readAsText(e[0])};let dropzone;function dragenter(e){e.stopPropagation(),e.preventDefault()}function dragover(e){e.stopPropagation(),e.preventDefault()}function drop(e){e.stopPropagation(),e.preventDefault();const t=e.dataTransfer.files;handleFileDrop(t)}function checkSubtitles(e){mediaDuration=0;const t=parseSRT(e);let n=0;const r=[],o=[],i=[],a=[],s=[],l=[],p=[],u=[],c=[];let h=0,f=0,d=0,g=0,v=0,m=0;t.map(e=>{const t=Math.ceil(1e3*e.start-1e3*n),w=Math.ceil(1e3*e.end-1e3*e.start),y=e.text.replace(/<\/?i>|<br\s?\/>/g,""),x=y.length,b=(x/w*1e3).toFixed(2),C={id:e.id,duration:w,cps:b,length:x,over20Chars:x>20,text:e.text,gapToPrevious:t},k=e.text.replace(/<\/?i>/g,"").split(/<br\s?\/>/),E=k[0],T=k[1]?k[1]:"";w<2e3&&a.push(C),w>7e3&&s.push(C),b>=16&&l.push(C),b>=14&&b<16&&i.push(C),t<80&&p.push(C),y.length>35&&(E.length>35||T.length>35)&&(C.lineOneLength=E.length,C.lineTwoLength=T?T.length:0,u.push(C)),y.length>33&&(E.length>33&&E===E.toUpperCase()||T.length>33&&T===T.toUpperCase())&&(C.lineOneLength=E.length,C.lineTwoLength=T?T.length:0,c.push(C)),t<=999&&h++,t>=1e3&&t<=2999&&f++,t>=3e3&&t<=4999&&d++,t>=5e3&&t<=9999&&g++,t>=1e4&&t<=29999&&v++,t>=3e4&&m++,r.push(C),o.push(t),n=e.end});o.sort((function(e,t){return e>t?1:-1}));weightedGaps=6*h+5*f+4*d+3*g+2*v+1*m,subGapDifficulty=weightedGaps/mediaDuration;const w=a.filter(e=>e.over20Chars),y=(i.length/r.length*100).toFixed(2),x=y>5,b=!!(w.length+s.length+l.length+p.length+u.length),C=!!i.length;return{minDurationViolations:w,maxDurationViolations:s,maxCpsViolations:l,minGapViolations:p,lineLengthViolations:u,allCapsLineLengthViolations:c,subsOverOptimalCps:i,nonOptimalCpsPercentage:y,hasErrors:b,hasWarnings:C,hasNonOptimalCpsError:x}}dropzone=document.getElementById("dropzone"),dropzone.addEventListener("dragenter",dragenter,!1),dropzone.addEventListener("dragover",dragover,!1),dropzone.addEventListener("drop",drop,!1);