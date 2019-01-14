Face recognition using email adresses in mjpg stream
====

## How to install:

  npm install gravatar-face-camera
  
## How to use:

Just provide a list of email adresses that you want to find and an url to a camera stream. The email addresses will be downloaded from gravatar.

Usually wifi-connected security cameras emit a mjpg stream at an url.


    const faceCamera = require('gravatar-face-camera')
    const emails = [
      'christian.landgren@iteam.se', 
      ..., 
      ]

    const cameraUrl = 'http://192.168.110.105/mjpg/video.mjpg'
    faceCamera(emails, cameraUrl).on('match', prediction => {
      console.log('Welcome', prediction.className)
    })


## Options

    {
      minimumDistance: 0.6, // Between 0-1. Minimum euclidean distance until a match is emitted. Higher value will emit more often but be less accurate.
      throttleTime: 500 // minimum time to wait until next frame is captured
    }

## Dependencies
Please see `npm face-recognition` for more information on how to optimize for each platform. https://www.npmjs.com/package/face-recognition 
  
## License

MIT, (c) Copyright 2019 Christian Landgren, Iteam
