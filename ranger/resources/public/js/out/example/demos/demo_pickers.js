// Compiled by ClojureScript 1.10.339 {}
goog.provide('example.demos.demo_pickers');
goog.require('cljs.core');
goog.require('reagent.core');
goog.require('material_ui');
goog.require('material_ui_icons');
goog.require('example.utils.js');
goog.require('example.demos.picker');
goog.require('example.demos.demo_text_field');
example.demos.demo_pickers.global$module$material_ui = goog.global["MaterialUI"];
example.demos.demo_pickers.global$module$material_ui_icons = goog.global["MaterialUIIcons"];
example.demos.demo_pickers.model_default = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"to-date","to-date",500848648),"2018-10-29",new cljs.core.Keyword(null,"to-date-display","to-date-display",1095798952),"16 10 2018",new cljs.core.Keyword(null,"to-time","to-time",-276247292),"13:30",new cljs.core.Keyword(null,"to","to",192099007),"2018-10-29",new cljs.core.Keyword(null,"from","from",1815293044),"2018-10-29"], null);
example.demos.demo_pickers.model = reagent.core.atom.call(null,example.demos.demo_pickers.model_default);
example.demos.demo_pickers.handle_date_change = (function example$demos$demo_pickers$handle_date_change(e){
return cljs.core.print.call(null,"date change! ",e.target.value);
});
example.demos.demo_pickers.display_date = (function example$demos$demo_pickers$display_date(){
return new cljs.core.Keyword(null,"to-date-display","to-date-display",1095798952).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,example.demos.demo_pickers.model));
});
example.demos.demo_pickers.handle_js_click = (function example$demos$demo_pickers$handle_js_click(ev){
var hello = (cljs.core.truth_(window.drp)?window.drp.getDateMoment("BaseStart"):"not ready");
return cljs.core.print.call(null,"hello",hello);
});
example.demos.demo_pickers.demo_pickers = (function example$demos$demo_pickers$demo_pickers(p__22354){
var map__22355 = p__22354;
var map__22355__$1 = ((((!((map__22355 == null)))?(((((map__22355.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__22355.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22355):map__22355);
var props = map__22355__$1;
var classes = cljs.core.get.call(null,map__22355__$1,new cljs.core.Keyword(null,"classes","classes",2037804510));
return reagent.core.create_class.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"component-will-mount","component-will-mount",209708855),((function (map__22355,map__22355__$1,props,classes){
return (function (){
return null;
});})(map__22355,map__22355__$1,props,classes))
,new cljs.core.Keyword(null,"component-did-mount","component-did-mount",-1126910518),((function (map__22355,map__22355__$1,props,classes){
return (function (){
return null;
});})(map__22355,map__22355__$1,props,classes))
,new cljs.core.Keyword(null,"reagent-render","reagent-render",-985383853),((function (map__22355,map__22355__$1,props,classes){
return (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"style","style",-496642736),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"display","display",242065432),"flex",new cljs.core.Keyword(null,"flexDirection","flexDirection",1286039598),"column",new cljs.core.Keyword(null,"position","position",-2011731912),"relative",new cljs.core.Keyword(null,"margin","margin",-995903681),(50),new cljs.core.Keyword(null,"alignItems","alignItems",410331199),"left"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [example.demos.picker.picker_view,classes], null)], null);
});})(map__22355,map__22355__$1,props,classes))
], null));
});

//# sourceMappingURL=demo_pickers.js.map?rel=1542638817508
