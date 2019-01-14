const faceCamera = require('../')
const emails = [
  'christian.landgren@iteam.se', 
  'cl@iteam.se', 
  'anders.bornholm@iteam.se', 
  'alexander.czigler@iteam.se',
  'johan.obrink@iteam.se']

const cameraUrl = 'http://192.168.110.105/mjpg/video.mjpg'
faceCamera(emails, cameraUrl, {minimumDistance: 0.9}).on('match', prediction => {
  console.log('Welcome', prediction.className)
})
