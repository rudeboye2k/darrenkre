(function(){
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  if(!shots.length) return;
  var lb=document.getElementById('lb'), img=document.getElementById('lbImg'),
      nm=document.getElementById('lbName'), mt=document.getElementById('lbMeta'),
      gp=document.getElementById('lbGrp'), qb=document.getElementById('lbQ'),
      ps=document.getElementById('lbPos'), cur=-1, opener=null;

  function show(i){
    if(i<0) i=shots.length-1;
    if(i>=shots.length) i=0;
    cur=i;
    var b=shots[i], d=b.dataset;
    img.src=d.src; img.alt=d.name;
    nm.textContent=d.name; mt.textContent=d.meta; gp.textContent=d.grp;
    qb.textContent=d.ql; qb.className='qb '+d.q;
    ps.textContent=(i+1)+' of '+shots.length;
  }
  function open(i,from){
    opener=from||null;
    lb.hidden=false;
    document.body.style.overflow='hidden';
    show(i);
    document.getElementById('lbX').focus();
  }
  function close(){
    lb.hidden=true; img.src='';
    document.body.style.overflow='';
    if(opener){ opener.focus(); opener=null; }
  }
  shots.forEach(function(b,i){ b.addEventListener('click',function(){ open(i,b); }); });
  document.getElementById('lbX').addEventListener('click',close);
  document.getElementById('lbP').addEventListener('click',function(e){e.stopPropagation();show(cur-1);});
  document.getElementById('lbN').addEventListener('click',function(e){e.stopPropagation();show(cur+1);});
  lb.addEventListener('click',function(e){ if(e.target===lb||e.target.classList.contains('lb-stage')) close(); });
  document.addEventListener('keydown',function(e){
    if(lb.hidden) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowLeft') show(cur-1);
    else if(e.key==='ArrowRight') show(cur+1);
  });
  // swipe on touch
  var x0=null;
  lb.addEventListener('touchstart',function(e){ x0=e.changedTouches[0].clientX; },{passive:true});
  lb.addEventListener('touchend',function(e){
    if(x0===null) return;
    var dx=e.changedTouches[0].clientX-x0;
    if(Math.abs(dx)>50) show(cur+(dx<0?1:-1));
    x0=null;
  },{passive:true});
})();
