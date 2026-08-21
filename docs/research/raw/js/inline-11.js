
;(function(){
  const feed = [
    {name:"Chris from Los Angeles, CA",item:"Pro Plan",time:"2 minutes ago",img:"https://cdn.prod.website-files.com/5df46942a58b624e33c85abe/685513e5ad04fd93054046ce_Chris_Signature.png"},
    {name:"Evan from Austin, TX",   item:"Pro Plan",time:"12 minutes ago",img:"https://cdn.prod.website-files.com/5df46942a58b624e33c85abe/685513e5ad7adafc1fb9ae05_Evan_signature.png"},
    {name:"Logan from Miami, FL",   item:"Pro Plan",time:"8 minutes ago",img:"https://cdn.prod.website-files.com/5df46942a58b624e33c85abe/685513e507e63d4ce0220052_Logan_signature.png"},
    {name:"George from Seattle, WA",item:"Enterprise Plan",time:"20 minutes ago",img:"https://cdn.prod.website-files.com/5df46942a58b624e33c85abe/685513e52a3612f44f4cb57f_George_signature.png"},
    {name:"Clarity from New York, NY",item:"Enterprise Plan",time:"27 minutes ago",img:"https://cdn.prod.website-files.com/5df46942a58b624e33c85abe/685513e4a84e0335c32cfa6e_Clarity_signature.png"}
  ];
  const badge = "https://cdn.prod.website-files.com/5df46942a58b624e33c85abe/64bc0888639b1ab025f4bc2e_verification_500px_00053.webp";
  const delays = [5000,8000,8000,12000,7000];
  const visDur = 5500, fadeDur = 600;
  const wrap = document.getElementById("proofWidget");
  let i = 0;

  function showNext(){
    if(i >= feed.length) return;
    // remove old
    const oldC = wrap.querySelector(".proofCard");
    if(oldC){
      oldC.style.transition  = `opacity ${fadeDur}ms ease-out, transform ${fadeDur}ms ease-out`;
      oldC.style.opacity     = 0;
      oldC.style.transform   = "translateY(-6px)";
      setTimeout(()=> wrap.removeChild(oldC), fadeDur);
    }
    // build new
    const e = feed[i];
    const isBadge = (i===0||i===2);
    const timeText = isBadge ? "Just now" : e.time;
    const card = document.createElement("div");
    card.className = "proofCard";
    card.style.cssText = `
      position:relative;
      backdrop-filter:blur(8px);
      background:rgba(255,255,255,0.9);
      border:1px solid #26b7ff;
      border-radius:12px;
      box-shadow:0 0 8px rgba(38,183,255,0.6);
      display:flex;
      align-items:center;
      gap:12px;
      padding:12px 44px 12px 12px;
      opacity:0;
      transform:translateY(6px);
      transition:opacity ${fadeDur}ms ease-out, transform ${fadeDur}ms ease-out;
      overflow:hidden;
    `;
    card.innerHTML = `
      <img src="${e.img}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:4px;font-size:14px;font-weight:500;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${e.name}<img src="${badge}" style="width:14px">
        </div>
        <div style="font-size:13px;color:#666;margin-top:8px">Purchased ${e.item}</div>
        <div style="margin-top:4px">
          ${
            isBadge
            ? `<span style="display:inline-block;padding:2px 6px;border-radius:8px;background:linear-gradient(135deg,#26b7ff,#1d4afe);color:white;font-size:12px">
                 ${timeText}
               </span>`
            : `<span style="font-size:12px;color:#999">${timeText}</span>`
          }
        </div>
      </div>
      <button class="closeCard" style="
        position:absolute;top:8px;right:8px;
        background:rgba(0,0,0,0.1);border:none;border-radius:50%;
        width:24px;height:24px;font-size:16px;color:#fff;
        line-height:24px;text-align:center;cursor:pointer
      ">×</button>
    `;
    wrap.appendChild(card);
    requestAnimationFrame(()=>{
      card.style.opacity   = 1;
      card.style.transform = "translateY(0)";
    });
    card.querySelector(".closeCard").onclick = ()=> wrap.remove();

    // schedule removal + next
    setTimeout(()=>{
      card.style.opacity   = 0;
      card.style.transform = "translateY(-6px)";
      setTimeout(()=>{
        if(wrap.contains(card)) wrap.removeChild(card);
        i++;
        setTimeout(showNext, delays[i]||0);
      }, fadeDur);
    }, visDur);
  }

  // start
  setTimeout(showNext, delays[0]);
})();
