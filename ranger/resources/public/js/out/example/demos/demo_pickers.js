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
example.demos.demo_pickers.demo_pickers = (function example$demos$demo_pickers$demo_pickers(p__25389){
var map__25390 = p__25389;
var map__25390__$1 = ((((!((map__25390 == null)))?(((((map__25390.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__25390.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__25390):map__25390);
var props = map__25390__$1;
var classes = cljs.core.get.call(null,map__25390__$1,new cljs.core.Keyword(null,"classes","classes",2037804510));
return reagent.core.create_class.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"component-will-mount","component-will-mount",209708855),((function (map__25390,map__25390__$1,props,classes){
return (function (){
return null;
});})(map__25390,map__25390__$1,props,classes))
,new cljs.core.Keyword(null,"component-did-mount","component-did-mount",-1126910518),((function (map__25390,map__25390__$1,props,classes){
return (function (){
return null;
});})(map__25390,map__25390__$1,props,classes))
,new cljs.core.Keyword(null,"reagent-render","reagent-render",-985383853),((function (map__25390,map__25390__$1,props,classes){
return (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"style","style",-496642736),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"display","display",242065432),"flex",new cljs.core.Keyword(null,"flexDirection","flexDirection",1286039598),"column",new cljs.core.Keyword(null,"position","position",-2011731912),"relative",new cljs.core.Keyword(null,"margin","margin",-995903681),(50),new cljs.core.Keyword(null,"alignItems","alignItems",410331199),"left"], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"h2","h2",-372662728),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"style","style",-496642736),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"margin","margin",-995903681),"20px 0px"], null)], null),"Date Range Picker"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [example.demos.picker.picker_view,classes], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"style","style",-496642736),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"margin-top","margin-top",392161226),(50)], null)], null),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,">",">",-555517146),example.demos.demo_pickers.global$module$material_ui.Button,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"variant","variant",-424354234),"contained",new cljs.core.Keyword(null,"color","color",1011675173),"secondary",new cljs.core.Keyword(null,"style","style",-496642736),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"text-transform","text-transform",1685000676),"none"], null),new cljs.core.Keyword(null,"class","class",-2030961996),classes.button,new cljs.core.Keyword(null,"on-click","on-click",1632826543),example.demos.demo_pickers.handle_js_click], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"style","style",-496642736),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"margin-right","margin-right",809689658),(10)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,">",">",-555517146),example.demos.demo_pickers.global$module$material_ui_icons.LocalCafe], null)], null),"Talk to Javascript"], null)], null)], null);
});})(map__25390,map__25390__$1,props,classes))
], null));
});

//# sourceMappingURL=demo_pickers.js.map?rel=1542575659849
