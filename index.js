srtFile = process.argv[2]
mediaDuration = process.argv[3]

if (srtFile == undefined) {
  console.error('Subtitle file missing.')
  process.exit()
}
// if (mediaDuration == undefined) {
//   console.error('Media duration missing (in minutes).')
//   process.exit()
// }

const fs = require('fs')
const parse = require('parse-srt')

const subs = fs.readFileSync(srtFile).toString()
const jsonSubs = parse(subs)

let lastSubEnd = 0

const allSubs = []
const gapsBetweenSubs = []

const subsUnderMinDuration = []
const maxDurationViolations = []
const maxCpsViolations = []
const minGapViolations = []
const lineLengthViolations = []

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
  if (timeToPrevSub < 80) {
    minGapViolations.push(currSub)
  }
  if (text.length > 35) {
    const lines = sub.text.replace(/<\/?i>/g, '').split(/<br\s?\/>/)
    
    if (lines[0].length > 35 || lines[1].length > 35)
    {
      lineLengthViolations.push(currSub)
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

console.log('MIN DURATION VIOLATIONS\n', minDurationViolations)
console.log('MAX DURATION VIOLATIONS\n', maxDurationViolations)
console.log('MAX CPS VIOLATIONS\n', maxCpsViolations)
console.log('MIN GAP VIOLATIONS\n', minGapViolations)
console.log('LINE LENGTH VIOLATIONS\n', lineLengthViolations)