Raphael.el.tooltip = function (tp) {
this.tp = tp;
this.tp.ox = 0;
//if(this.getBBox().x > 680) this.tp.ox = 600;
this.tp.oy = 0;
this.tp.hide();

this.mousemove(function(event){

if ( event.pageX == null && event.clientX != null ) {
    var bd = document.body;
    event.pageX = event.clientX + (event && event.scrollLeft || bd.scrollLeft || 0);
    event.pageY = event.clientY + (event && event.scrollTop || bd.scrollTop || 0);
  };

if(this.getBBox().x < 420)
{
var dif = 70;
}
else
{
var dif=-250;
}
  
var trans='"T' + (event.pageX + dif - $('#hemicycle').offset().left) + ',' + (event.pageY - $('#hemicycle').offset().top) + '"';

this.tp.transform(trans);
  //this.tp.translate(event.pageX - $('#hemicycle').offset().left,event.pageY - this.tp.oy);
this.tp.ox = event.pageX;
this.tp.oy = event.pageY;
this.tp.show().toFront();
});

this.hover(
function(event){
this.tp.show().toFront();
},
function(event){
this.tp.hide();
this.unmousemove();
});
return this;
};

Raphael.el.setToolTipText = function(tip) {
this.paper.setStart();
// Create background
if(Raphael.type=="SVG") var frameEl = this.paper.rect(0.5, 0.5, 0, 0, 5);
// Create text element
var textEl = this.paper.text(5, 0, tip).attr({'text-anchor':'start', 'font-size':11});
var bbox = textEl.getBBox();
// Resize the background to fit the text
if(Raphael.type=="SVG") frameEl.attr({width:bbox.width + 10, height: bbox.height+10, fill: '#E5F6FE', 'stroke-width':1, stroke:'#ADD9ED'});
// Move the text vertically to position it correctly
textEl.attr({y: Math.round(bbox.height/2)+5});
var set = this.paper.setFinish();
this.tooltip(set);
}

/*\
* Set.hoverset
[ method ]
**
* Manages the over/out mouse handlers of an entire set. Use Set.mouseover() and
* Set.mouseout() to apply over/out handlers to each individual item - so mousing
* from overlapping will fire out/over event. Set.hoverset will treat the entire
* set as a single element, so mousing over overlapping elements will not fire
* individual over/out events. Over handler will fire only when user mouses onto
* a set, and the out handler will fire only when the user mouses off the entire
* set.
*
* The optional outdelay parameter will allow the user to mouse off and then
* back onto a set within the specified number of milliseconds without firing the
* out handler.
**
> Parameters
**
- paper (object) the paper instance contianing the set
- overfunc (function) function to run when set is moused over
- outfunc (function) function to run when set is moused out
- [outdelay] (number) number of milliseconds of leinience to wait before firing the out event.
= (object) an object containing the mouseover and mouseout handlers. should be passed to the unhoverset function to remove the listeners
\*/
Raphael.st.hoverset = function(r, overfunc, outfunc, outdelay) {

var home = this;

var overhandler = function(evt){
if (!evt) evt = window.event;
r.getById((evt.srcElement || evt.target).raphaelid).data("Raphael.st.hoverset.over", true);

if(!home['Raphael.st.hoverset.overset']){
overfunc(evt);
}

home['Raphael.st.hoverset.overset'] = true;
}

var outhandler = function(evt){
var overset = false;
r.getById((evt.srcElement || evt.target).raphaelid).data("Raphael.st.hoverset.over", false);

clearTimeout(home['Raphael.st.hoverset.timeout']);
home['Raphael.st.hoverset.timeout'] = setTimeout(function(){
overset = lookForOver(home);
if(!overset){
home['Raphael.st.hoverset.overset'] = false;
outfunc(evt)
}
}, outdelay || 0);
}

var lookForOver = function(set) {
ret = false;
set.forEach(function(obj){
if(typeof(obj.forEach) == 'function') {
ret = lookForOver(obj);
if(ret) return false;
} else if(typeof(obj.data) != 'function'){
return true;
}else if(obj.data('Raphael.st.hoverset.over')){
ret = true;
return false;
}
});
return ret;
}

this.mouseover(overhandler);
this.mouseout(outhandler);

return {
overhandler: overhandler,
outhandler: outhandler
}
}

/*\
* Set.unhoverset
[ method ]
**
* Removes Set.hoverset mouse handlers
**
> Parameters
**
- obj (object) the object returned by the Set.hoverset call to be removed
\*/
Raphael.st.unhoverset = function(obj) {
this.unmouseover(obj.overhandler);
this.unmouseout(obj.outhandler);
}