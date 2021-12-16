const body = document.body;
let rearCamera = true;
let width = 320;
let height = 0;
let streaming = false;

// Camera
const cameraFeed = document.getElementById('cameraFeed');

// Download Link
const downloadLink = document.getElementById('downloadLink');

// Camera Elements
// Controller 
const controller = document.createElement('div');
controller.classList.add('controller');

// Take Photo Button
const photoCaptureBtn = document.createElement('button');
photoCaptureBtn.innerText = "Take Photo"
photoCaptureBtn.addEventListener('click', e => {
    takePhoto(cameraFeed.width, cameraFeed.height);
    e.preventDefault(); // Prevents unexpected rehandling of the event
});
controller.appendChild(photoCaptureBtn);

// Swap Camera Button
const swapCameraBtn = document.createElement('button');
swapCameraBtn.innerText = "Swap Camera"
swapCameraBtn.addEventListener('click', () => {
    swapCamera();
})
controller.appendChild(swapCameraBtn);

// Get Permissions Button
const permissionsBtn = document.getElementById('permissionsBtn');
permissionsBtn.addEventListener('click', () => {
    const accessGranted = startCamera({ audio : false, video : true });
    if (accessGranted) {
        body.removeChild(permissionsBtn);
        body.appendChild(controller);
        return;
    }
    console.log('Not Authorised');
});

// Camera Functions
cameraFeed.addEventListener('canplay', e => {
    if (!streaming) {
        height = cameraFeed.videoHeight / (cameraFeed.videoWidth / width);
        cameraFeed.setAttribute('width', width);
        cameraFeed.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
    }
}, false);

const startCamera = async constraints => {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        cameraFeed.stream = stream;
        cameraFeed.srcObject = stream;
        cameraFeed.onloadedmetadata = () => {
            cameraFeed.play();
        };
    } catch (err) {
        if (err.name === 'OverconstrainedError' && err.constraint === 'facingMode') return console.log('unable to access user\'s selfie camera');
        console.log(`An error occured: ${err}`);
    }
};

const stopCamera = () => {
    streaming = false;
    cameraFeed.srcObject = null;
    cameraFeed.pause();
}

const swapCamera = () => {
    stopCamera();
    let cameraDirection;
    rearCamera = !rearCamera;
    if (rearCamera) { cameraDirection = "environment"}
    else { cameraDirection = "user" }

    startCamera({ video : { facingMode : { exact : cameraDirection }}} )
};

const takePhoto = (width, height) => {
    if (width &&  height) {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d'); 
        canvas.width = width;
        canvas.height = height;
        context.drawImage(
            cameraFeed,
            0,
            0,
            width,
            height
        );

        const imgData = canvas.toDataURL('image/png');

        downloadLink.setAttribute('download', 'koala');
        downloadLink.setAttribute('href', imgData);

        const photo = document.getElementById('photo');
        photo.setAttribute('src', imgData);
    } else {
        clearPhoto();
    } 
};

const clearPhoto = () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.fillStyle = "#AAA"
    context.fillRect(0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL('image/png');
    const photo = document.getElementById('photo');
    photo.setAttribute('src', imgData);
};