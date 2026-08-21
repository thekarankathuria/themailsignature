
;(function(){
  const bgVideo   = document.getElementById("bgVideo")
  const mainVideo = document.getElementById("customVideo")
  const playBtn   = document.getElementById("playPauseBtn")
  const icon      = document.getElementById("btnIcon")
  const stamp     = document.getElementById("timeStamp")
  const closeBtn  = document.getElementById("closeBtn")
  const embedWrap = document.currentScript.parentNode
  const total     = 170

  function fmt(sec){
    const m = Math.floor(sec/60)
    const s = (sec%60).toString().padStart(2,"0")
    return m + ":" + s
  }

  mainVideo.addEventListener("timeupdate",()=>{
    const left = Math.max(0, total - Math.floor(mainVideo.currentTime))
    stamp.textContent = fmt(left)
  })

  playBtn.addEventListener("click",()=>{
    if(mainVideo.paused){
      bgVideo.style.display = "none"
      mainVideo.style.display = "block"
      mainVideo.play()
      icon.src = "https://cdn.prod.website-files.com/5df46942a58b624e33c85abe/6809a1252ebc096b0e82bfc4_pause_white.png"
    } else {
      mainVideo.pause()
      icon.src = "https://cdn.prod.website-files.com/5df46942a58b624e33c85abe/6809a11fa598aea4689e2b0f_play_white.png"
    }
  })

  closeBtn.addEventListener("click",()=>{
    bgVideo.pause()
    mainVideo.pause()
    embedWrap.style.transition = "opacity 0.4s ease"
    embedWrap.style.opacity    = 0
    setTimeout(()=> embedWrap.style.display = "none", 400)
  })
})()
