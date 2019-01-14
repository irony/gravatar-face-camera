const fr = require('face-recognition')
const fetch = require('node-fetch')
const fs = require('fs')
const gravatar = require('gravatar-url')
const mjpg = require('pipe2jpeg')
const detector = fr.AsyncFaceDetector()

const download = (url, dest) => fetch(url).then(res => new Promise(resolve => res.body.pipe(fs.createWriteStream(dest).once('finish', resolve))))
const downloadAvatars = (emails) => Promise.all(emails
    .map(email => ({
      email, 
      filename: `./images/${email}.jpg`, 
      url: gravatar(email, {s: 300})
    }))
    .map(async ({email, filename, url}) => ({
      email, 
      stream: await download(url, filename), 
      filename
    })))

const detectFaces = (images) => images
  .map(({email, filename}) => {
    try {
      return ({email, image: fr.loadImage(filename)})
    } catch (err) {
      return
    }
  })
  .filter(a => a)
  .map(async loaded => {
    const face = await detector.detectFaces(loaded.image)
    return ({...loaded, face})
  })
  .filter(a => a)

const train = async (images, jitters = 15) => {
  const recognizer = fr.FaceRecognizer()
  const faces = await Promise.all(detectFaces(images))
  faces
    .filter(face => face.face.length)
    .forEach(({email, face}) => recognizer.addFaces(face, email, jitters))
  return recognizer
}

let last = Date.now()
const throttle = (ms, fn) => {
  if (Date.now() - last < ms) return // poor mans throttling
  last = Date.now()
  fn()
}

const findEmailsInCameraStream = (emails, url, {minimumDistance = 0.6, throttleTime = 500} = {}) => {
  const jpg = new mjpg()

  downloadAvatars(emails)
    .then(train)
    .then(recognizer => {
      jpg.on('jpeg', async (buffer) => throttle(throttleTime, async () => {
        const filename = './images/camera.jpg'
        fs.writeFileSync(filename, buffer)
        const faces = await detector.detectFaces(fr.loadImage(filename))
        if (!faces.length) return
        jpg.emit('face', faces)
        const prediction = recognizer.predictBest(faces[0])
        if (prediction.distance > minimumDistance) return
        jpg.emit('match', prediction)
      }))
      fetch(url).then(res => res.body.pipe(jpg))
    })

  return jpg
}

module.exports = findEmailsInCameraStream