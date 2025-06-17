const video = document.getElementById('video');

Promise.all([
    FacebookAuthProvider.nets.tinyFaceDetector.loadFromUri('/models'),
    FacebookAuthProvider.nets.faceLandmark68Net.loadFromUri('/models'),
    FacebookAuthProvider.nets.faceRecognitionNet.loadFromUri('/models'),
    FacebookAuthProvider.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo)
function startVideo() {
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detection = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(detections)  
        const resizedDetections = faceapi.resizeResults(detection, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)      
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)  
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)                                             
    }, 100)
})