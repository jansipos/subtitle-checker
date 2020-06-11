let globalSubs = null
const template = document.getElementById('template').innerHTML

const handleFileDrop = function (files) {
  const reader = new FileReader()
  reader.onload = function(){
    const subs = reader.result
    globalSubs = subs
    
    const result = checkSubtitles(subs)
    
    rendered = Mustache.render(template, result);
    document.getElementById('result').innerHTML = rendered;
    
    const subheadings = document.getElementsByClassName('subheading')
    for (let i = 0; i < subheadings.length; i++) {
      
      subheadings[i].addEventListener('click', function (e) {
        
        if (e.target != subheadings[i]) {
          e.target.parentNode.classList.toggle('open')
          return
        }
        
        e.target.classList.toggle('open')
      })
      
    }
  }
  reader.readAsText(files[0])
}

let dropzone;

function dragenter(e) {
  e.stopPropagation()
  e.preventDefault()
}

function dragover(e) {
  e.stopPropagation()
  e.preventDefault()
}

function drop(e) {
  e.stopPropagation()
  e.preventDefault()
  
  const dt = e.dataTransfer
  const files = dt.files
  
  handleFileDrop(files)
}

dropzone = document.getElementById("dropzone")
dropzone.addEventListener("dragenter", dragenter, false)
dropzone.addEventListener("dragover", dragover, false)
dropzone.addEventListener("drop", drop, false)

function checkSubtitles(subs) {
  
  mediaDuration = 0
  const jsonSubs = parseSRT(subs)
  
  let lastSubEnd = 0
  
  const allSubs = []
  const gapsBetweenSubs = []
  
  const subsOverOptimalCps = []
  const subsUnderMinDuration = []
  const maxDurationViolations = []
  const maxCpsViolations = []
  const minGapViolations = []
  const lineLengthViolations = []
  const allCapsLineLengthViolations = []
  
  // 80-999 ms
  let bucketA = 0
  // 1000-2999 ms
  let bucketB = 0
  // 3000-4999 ms
  let bucketC = 0
  // 5000-9999 ms
  let bucketD = 0
  // 10000-29999 ms
  let bucketE = 0
  // 30000+ ms
  let bucketF = 0
  
  jsonSubs.map(sub => {
    // object properties
    const timeToPrevSub = Math.ceil(sub.start * 1000 - lastSubEnd * 1000)
    const duration = Math.ceil(sub.end * 1000 - sub.start * 1000)
    const text = sub.text.replace(/<\/?i>|<br\s?\/>/g, '')
    const length = text.length
    const cps = ((length/duration) * 1000).toFixed(2)
    
    const currSub = {
      id: sub.id,
      duration,
      cps,
      length,
      over20Chars: length > 20,
      text: sub.text,
      gapToPrevious: timeToPrevSub
    }
    
    const lines = sub.text.replace(/<\/?i>/g, '').split(/<br\s?\/>/)
    const L1 = lines[0]
    const L2 = lines[1] ? lines[1] : ''
    
    // violations
    if (duration < 2000) {
      subsUnderMinDuration.push(currSub)
    }
    if (duration > 7000) {
      maxDurationViolations.push(currSub)
    }
    if (cps >= 16) {
      maxCpsViolations.push(currSub)
    }
    if (cps >= 14 && cps < 16) {
      subsOverOptimalCps.push(currSub)
    }
    if (timeToPrevSub < 80) {
      minGapViolations.push(currSub)
    }
    if (text.length > 35) {
      
      if (L1.length > 35 || L2.length > 35)
      {
        currSub.lineOneLength = L1.length
        currSub.lineTwoLength = L2 ? L2.length : 0
        lineLengthViolations.push(currSub)
      }
    }
    if (text.length > 33) {
      
      if (L1.length > 33 && L1 === L1.toUpperCase() || L2.length > 33 && L2 === L2.toUpperCase()) {
        currSub.lineOneLength = L1.length
        currSub.lineTwoLength = L2 ? L2.length : 0
        allCapsLineLengthViolations.push(currSub)
      }
    }
    
    // gap buckets
    if (timeToPrevSub <= 999) { bucketA++ }
    if (timeToPrevSub >= 1000 && timeToPrevSub <= 2999) { bucketB++ }
    if (timeToPrevSub >= 3000 && timeToPrevSub <= 4999) { bucketC++ }
    if (timeToPrevSub >= 5000 && timeToPrevSub <= 9999) { bucketD++ }
    if (timeToPrevSub >= 10000 && timeToPrevSub <= 29999) { bucketE++ }
    if (timeToPrevSub >= 30000) { bucketF++ }
    
    allSubs.push(currSub)
    
    gapsBetweenSubs.push(timeToPrevSub)
    lastSubEnd = sub.end
  })
  
  const sortedGaps = gapsBetweenSubs.sort(function(a, b) {
    return a > b ? 1 : -1
  })
  
  weightedGaps = bucketA * 6 + bucketB * 5 + bucketC * 4 + bucketD * 3 + bucketE * 2 + bucketF * 1
  subGapDifficulty = weightedGaps / mediaDuration
  
  const minDurationViolations = subsUnderMinDuration.filter(sub => sub.over20Chars)
  const nonOptimalCpsPercentage = ((subsOverOptimalCps.length / allSubs.length) * 100).toFixed(2)
  const hasNonOptimalCpsError = nonOptimalCpsPercentage > 5
  
  const hasErrors = !!(minDurationViolations.length + maxDurationViolations.length + maxCpsViolations.length + minGapViolations.length + lineLengthViolations.length)
  const hasWarnings = !!subsOverOptimalCps.length
  
  return {
    minDurationViolations,
    maxDurationViolations,
    maxCpsViolations,
    minGapViolations,
    lineLengthViolations,
    allCapsLineLengthViolations,
    subsOverOptimalCps,
    nonOptimalCpsPercentage,
    hasErrors,
    hasWarnings,
    hasNonOptimalCpsError
  }
}