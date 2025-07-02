document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, setting up everything.');

    // تابع برای نمایش/مخفی کردن دکمه Choose File
    function toggleFileButton() {
        const type = document.getElementById('qrType').value;
        const fileButton = document.getElementById('fileButton');
        fileButton.style.display = (type === 'image' || type === 'pdf') ? 'inline-block' : 'none';
    }

    // Event listener برای تغییر نوع QR code
    document.getElementById('qrType').addEventListener('change', toggleFileButton);

    // فراخوانی اولیه برای تنظیم وضعیت اولیه دکمه Choose File
    toggleFileButton();

    function generateQRCode(type, input, file) {
        console.log('generateQRCode called with:', { type, input, file });  // دیباگ: بررسی پارامترها
        let qrContent = '';
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = '';

        if (!type) {
            errorMessage.textContent = 'نوع QR code مشخص نشده.';
            return;
        }

        switch(type) {
            case 'url':
                if (!input) {
                    errorMessage.textContent = 'لطفاً یک URL وارد کنید.';
                    return;
                }
                qrContent = input;
                break;
            case 'image':
            case 'pdf':
                if (!file) {
                    errorMessage.textContent = 'لطفاً یک فایل انتخاب کنید.';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    qrContent = e.target.result;
                    console.log('File read, now calling createQRCode');
                    createQRCode(qrContent);
                };
                reader.readAsDataURL(file);
                return;
            default:
                errorMessage.textContent = 'نوع نامعتبر.';
                return;
        }
        createQRCode(qrContent);  // فراخوانی تابع بعدی
    }

    function createQRCode(content) {
        console.log('createQRCode called with content:', content);
        const qrCodeDiv = document.getElementById("qrCode");
        qrCodeDiv.innerHTML = '';
        try {
            const qrCode = new QRCode(qrCodeDiv, {
                text: content,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            const downloadButton = document.getElementById('downloadButton');
            downloadButton.classList.remove('d-none');
            downloadButton.onclick = function() {
                const canvas = qrCodeDiv.querySelector('canvas');
                if (canvas) {
                    const dataURL = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = dataURL;
                    link.download = 'qrcode.png';
                    link.click();
                } else {
                    console.error('No canvas found');
                    document.getElementById('errorMessage').textContent = 'خطا در تولید QR code.';
                }
            };
        } catch (error) {
            console.error('Error in createQRCode:', error);
            document.getElementById('errorMessage').textContent = 'تولید QR code شکست خورد.';
        }
    }

    const qrForm = document.getElementById('qrForm');
    if (qrForm) {
        qrForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const type = document.getElementById('qrType').value;
            const input = document.getElementById('qrInput').value;
            const file = document.getElementById('fileInput').files[0];
            console.log('Form submitted, parameters:', { type, input, file });
            generateQRCode(type, input, file);
        });
    } else {
        console.error('qrForm element not found.');
    }

    const fileButton = document.getElementById('fileButton');
    if (fileButton) {
        fileButton.addEventListener('click', function() {
            document.getElementById('fileInput').click();
        });
    }

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : '';
            document.getElementById('qrInput').value = fileName;
        });
    }
});