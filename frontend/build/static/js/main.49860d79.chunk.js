(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{13:function(e,n,a){e.exports={AppContainer:"App_AppContainer__381b2"}},17:function(e,n,a){e.exports=a(41)},2:function(e,n,a){e.exports={GrandSlamContainer:"GrandSlam_GrandSlamContainer__sZtwr",PlayerInfo:"GrandSlam_PlayerInfo__n2gBq",YearBox:"GrandSlam_YearBox__28JtZ",loader:"GrandSlam_loader__fuzhJ",load5:"GrandSlam_load5__1m9QO"}},22:function(e,n,a){},41:function(e,n,a){"use strict";a.r(n);var t=a(0),r=a.n(t),o=a(12),l=a.n(o),i=(a(22),a(13)),c=a.n(i),s=a(16),m=a(2),u=a.n(m),d=a(14),f=a(15),p=a(23).default,_=function(){function e(){Object(d.a)(this,e)}return Object(f.a)(e,null,[{key:"getMostSingles",value:function(e){return new Promise((function(n,a){p.post("/atpstats/mostSingles",{tourneyId:e}).then((function(e){return n(e.data)})).catch((function(e){return a(e)}))}))}},{key:"mock_getMostSingles",value:function(e){return new Promise((function(e){e({player:"John Doe",wins:[1984,1996,2012]})}))}}]),e}();function S(e){var n=Object(t.useState)(r.a.createElement("div",{className:u.a.loader},"Loading...")),a=Object(s.a)(n,2),o=a[0],l=a[1];return Object(t.useEffect)((function(){var n=function(){var n=document.getElementById("mostRecentYear".concat(e.id)),a=n.style.opacity;n.style.opacity="0"!==a&&a?"0":"1"};_.getMostSingles(e.id).then((function(a){var t=a.wins[a.wins.length-1],o="mostRecentYear".concat(e.id);l(r.a.createElement("div",{className:u.a.PlayerInfo},r.a.createElement("h2",{onClick:n},a.player),r.a.createElement("div",{className:u.a.YearBox},r.a.createElement("h3",{id:o},t))))})).catch((function(e){l(r.a.createElement("h1",null,e.message))}))}),[e.id]),r.a.createElement("div",{className:u.a.GrandSlamContainer},r.a.createElement("h1",null,e.name),o)}var h=[{name:"Autralian Open",id:580},{name:"Roland Garros",id:520},{name:"Wimbledon",id:540},{name:"US Open",id:560}];var E=function(){var e=h.map((function(e){return r.a.createElement(S,{name:e.name,id:e.id,key:e.id})}));return r.a.createElement("div",{className:c.a.AppContainer},r.a.createElement("h1",null,"Grand Slam Most Single Titles"),e)};l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(E,null)),document.getElementById("root"))}},[[17,1,2]]]);
//# sourceMappingURL=main.49860d79.chunk.js.map