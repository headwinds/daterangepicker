// Compiled by ClojureScript 1.10.339 {}
goog.provide('example.events');
goog.require('cljs.core');
goog.require('reagent.core');
goog.require('re_frame.core');
goog.require('example.utils.http_fx');
goog.require('goog.object');
goog.require('example.db');
goog.require('reagent.impl.template');
re_frame.core.reg_event_db.call(null,new cljs.core.Keyword(null,"initialize","initialize",609952913),(function (_,___$1){
return example.db.default_db;
}));
re_frame.core.reg_event_db.call(null,new cljs.core.Keyword("example.events","set-active-demo","example.events/set-active-demo",-1754613640),(function (db,p__22664){
var vec__22665 = p__22664;
var _ = cljs.core.nth.call(null,vec__22665,(0),null);
var active_demo = cljs.core.nth.call(null,vec__22665,(1),null);
return cljs.core.assoc.call(null,db,new cljs.core.Keyword(null,"active-demo","active-demo",1389927874),active_demo);
}));
re_frame.core.reg_event_db.call(null,new cljs.core.Keyword(null,"active-demo","active-demo",1389927874),(function (db,p__22668){
var vec__22669 = p__22668;
var _ = cljs.core.nth.call(null,vec__22669,(0),null);
var active_demo = cljs.core.nth.call(null,vec__22669,(1),null);
return cljs.core.assoc.call(null,db,new cljs.core.Keyword(null,"active-demo","active-demo",1389927874),active_demo);
}));
re_frame.core.reg_event_fx.call(null,new cljs.core.Keyword(null,"get-starwars","get-starwars",926434839),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [((goog.DEBUG)?re_frame.core.debug:null)], null),(function (p__22672,p__22673){
var map__22674 = p__22672;
var map__22674__$1 = ((((!((map__22674 == null)))?(((((map__22674.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__22674.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22674):map__22674);
var db = cljs.core.get.call(null,map__22674__$1,new cljs.core.Keyword(null,"db","db",993250759));
var vec__22675 = p__22673;
var _ = cljs.core.nth.call(null,vec__22675,(0),null);
var payload = cljs.core.nth.call(null,vec__22675,(1),null);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"db","db",993250759),(function (){
cljs.core.assoc_in.call(null,db,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"loading?","loading?",1905707049),new cljs.core.Keyword(null,"starwars","starwars",-661703190)], null),true);

return cljs.core.assoc_in.call(null,db,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"starwars","starwars",-661703190),new cljs.core.Keyword(null,"page","page",849072397)], null),new cljs.core.Keyword(null,"page","page",849072397).cljs$core$IFn$_invoke$arity$1(payload));
})()
,new cljs.core.Keyword(null,"http-xhrio","http-xhrio",1846166714),example.utils.http_fx.GET.call(null,["https://swapi.co/api/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"resource","resource",251898836).cljs$core$IFn$_invoke$arity$1(payload)),"/?page=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"page","page",849072397).cljs$core$IFn$_invoke$arity$1(payload)),"&search=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"query","query",-1288509510).cljs$core$IFn$_invoke$arity$1(payload))].join(''),new cljs.core.Keyword(null,"get-starwars-success","get-starwars-success",1194191709),new cljs.core.Keyword(null,"get-starwars-fail","get-starwars-fail",-1743828903))], null);
}));
re_frame.core.reg_event_db.call(null,new cljs.core.Keyword(null,"get-starwars-success","get-starwars-success",1194191709),(function (db,p__22679){
var vec__22680 = p__22679;
var _ = cljs.core.nth.call(null,vec__22680,(0),null);
var response = cljs.core.nth.call(null,vec__22680,(1),null);
var records = new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(response);
var count = new cljs.core.Keyword(null,"count","count",2139924085).cljs$core$IFn$_invoke$arity$1(response);
return cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,db,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"starwars","starwars",-661703190),new cljs.core.Keyword(null,"records","records",1326822832)], null),records),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"starwars","starwars",-661703190),new cljs.core.Keyword(null,"count","count",2139924085)], null),count),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"loading?","loading?",1905707049),new cljs.core.Keyword(null,"starwars","starwars",-661703190)], null),false);
}));
re_frame.core.reg_event_db.call(null,new cljs.core.Keyword(null,"retrieve-session-fail","retrieve-session-fail",1570828969),(function (db,p__22683){
var vec__22684 = p__22683;
var _ = cljs.core.nth.call(null,vec__22684,(0),null);
var response = cljs.core.nth.call(null,vec__22684,(1),null);
return cljs.core.assoc_in.call(null,db,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"loading?","loading?",1905707049),new cljs.core.Keyword(null,"starwars","starwars",-661703190)], null),false);
}));
example.events.github_origin = "https://api.github.com";
re_frame.core.reg_event_fx.call(null,new cljs.core.Keyword(null,"get-github-events","get-github-events",2123865953),(function (p__22687,p__22688){
var map__22689 = p__22687;
var map__22689__$1 = ((((!((map__22689 == null)))?(((((map__22689.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__22689.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22689):map__22689);
var db = cljs.core.get.call(null,map__22689__$1,new cljs.core.Keyword(null,"db","db",993250759));
var vec__22690 = p__22688;
var _ = cljs.core.nth.call(null,vec__22690,(0),null);
var vals = cljs.core.nth.call(null,vec__22690,(1),null);
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"http-xhrio","http-xhrio",1846166714),example.utils.http_fx.GET.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1(example.events.github_origin),"/orgs/reagent-project/events"].join(''),new cljs.core.Keyword(null,"get-github-events-success","get-github-events-success",-594973983),new cljs.core.Keyword(null,"get-github-events-fail","get-github-events-fail",229912964))], null);
}));
re_frame.core.reg_event_db.call(null,new cljs.core.Keyword(null,"get-github-events-success","get-github-events-success",-594973983),(function (db,p__22694){
var vec__22695 = p__22694;
var _ = cljs.core.nth.call(null,vec__22695,(0),null);
var response = cljs.core.nth.call(null,vec__22695,(1),null);
return cljs.core.assoc.call(null,db,new cljs.core.Keyword(null,"user","user",1532431356),response);
}));
re_frame.core.reg_event_db.call(null,new cljs.core.Keyword(null,"get-github-events-fail","get-github-events-fail",229912964),(function (db,p__22698){
var vec__22699 = p__22698;
var _ = cljs.core.nth.call(null,vec__22699,(0),null);
var response = cljs.core.nth.call(null,vec__22699,(1),null);
return db;
}));

//# sourceMappingURL=events.js.map?rel=1542555965701
