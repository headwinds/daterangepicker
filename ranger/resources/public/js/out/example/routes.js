// Compiled by ClojureScript 1.10.339 {}
goog.provide('example.routes');
goog.require('cljs.core');
goog.require('goog.History');
goog.require('secretary.core');
goog.require('goog.events');
goog.require('goog.history.EventType');
goog.require('re_frame.core');
goog.require('reagent.core');
goog.require('example.events');
goog.require('example.subs');
goog.require('example.utils.http_fx');
goog.require('example.demos.demo_pickers');
example.routes.hook_browser_navigation_BANG_ = (function example$routes$hook_browser_navigation_BANG_(){
var G__22638 = (new goog.History());
goog.events.listen(G__22638,goog.history.EventType.NAVIGATE,((function (G__22638){
return (function (event){
return secretary.core.dispatch_BANG_.call(null,event.token);
});})(G__22638))
);

G__22638.setEnabled(true);

return G__22638;
});
example.routes.app_routes = (function example$routes$app_routes(){
secretary.core.set_config_BANG_.call(null,new cljs.core.Keyword(null,"prefix","prefix",-265908465),"#");

var action__22367__auto___22644 = (function (params__22368__auto__){
if(cljs.core.map_QMARK_.call(null,params__22368__auto__)){
var map__22639 = params__22368__auto__;
var map__22639__$1 = ((((!((map__22639 == null)))?(((((map__22639.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__22639.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22639):map__22639);
return re_frame.core.dispatch.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("example.events","set-active-demo","example.events/set-active-demo",-1754613640),"pickers"], null));
} else {
if(cljs.core.vector_QMARK_.call(null,params__22368__auto__)){
var vec__22641 = params__22368__auto__;
return re_frame.core.dispatch.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("example.events","set-active-demo","example.events/set-active-demo",-1754613640),"pickers"], null));
} else {
return null;
}
}
});
secretary.core.add_route_BANG_.call(null,"/",action__22367__auto___22644);


return example.routes.hook_browser_navigation_BANG_.call(null);
});
example.routes.get_main_demo = (function example$routes$get_main_demo(demo_name){
var G__22645 = demo_name;
switch (G__22645) {
case "pickers":
return example.demos.demo_pickers.demo_pickers;

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22645)].join('')));

}
});

//# sourceMappingURL=routes.js.map?rel=1542588611164
