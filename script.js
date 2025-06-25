document.getElementById('qrForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('qrType').value;
    const input = document.getElementById('qrInput').value;
    const file = document.getElementById('fileInput').files[0];
    generateQRCode(type, input, file);
});

document.getElementById('fileButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function() {
    const fileName = this.files[0].name;
    document.getElementById('qrInput').value = fileName;
});

function generateQRCode(type, input, file) {
    let qrContent = '';
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';

    switch(type) {
        case 'url':
            if (!input) {
                errorMessage.textContent = 'Please enter a URL.';
                return;
            }
            qrContent = input;
            break;
        case 'image':
        case 'pdf':
            if (!file) {
                errorMessage.textContent = 'Please select a file.';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                qrContent = e.target.result;
                createQRCode(qrContent);
            };
            reader.readAsDataURL(file);
            return; // We return here because the QR code generation is asynchronous
    }

    createQRCode(qrContent);
}

function createQRCode(content) {
    const qrCodeDiv = document.getElementById("qrCode");
    qrCodeDiv.innerHTML = ''; // Clear previous QR code

    const qrCode = new QRCode(qrCodeDiv, {
        text: content,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Enable download button
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.style.display = 'block';
    downloadButton.onclick = function() {
        const canvas = qrCodeDiv.querySelector('canvas');
        const dataURL = canvas.toDataURL('image/png');
        downloadButton.href = dataURL;
        downloadButton.download = 'qrcode.png';
    };
}