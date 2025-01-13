// Configuration
const ICON_SIZES = [
    { size: "20x20", idiom: "iphone", scale: "2x" },
    { size: "20x20", idiom: "iphone", scale: "3x" },
    { size: "29x29", idiom: "iphone", scale: "1x" },
    { size: "29x29", idiom: "iphone", scale: "2x" },
    { size: "29x29", idiom: "iphone", scale: "3x" },
    { size: "40x40", idiom: "iphone", scale: "2x" },
    { size: "40x40", idiom: "iphone", scale: "3x" },
    { size: "57x57", idiom: "iphone", scale: "1x" },
    { size: "57x57", idiom: "iphone", scale: "2x" },
    { size: "60x60", idiom: "iphone", scale: "2x" },
    { size: "60x60", idiom: "iphone", scale: "3x" },
    { size: "20x20", idiom: "ipad", scale: "1x" },
    { size: "20x20", idiom: "ipad", scale: "2x" },
    { size: "29x29", idiom: "ipad", scale: "1x" },
    { size: "29x29", idiom: "ipad", scale: "2x" },
    { size: "40x40", idiom: "ipad", scale: "1x" },
    { size: "40x40", idiom: "ipad", scale: "2x" },
    { size: "50x50", idiom: "ipad", scale: "1x" },
    { size: "50x50", idiom: "ipad", scale: "2x" },
    { size: "72x72", idiom: "ipad", scale: "1x" },
    { size: "72x72", idiom: "ipad", scale: "2x" },
    { size: "76x76", idiom: "ipad", scale: "1x" },
    { size: "76x76", idiom: "ipad", scale: "2x" },
    { size: "83.5x83.5", idiom: "ipad", scale: "2x" },
    { size: "1024x1024", idiom: "ios-marketing", scale: "1x" }
];

// DOM Elements
const imageInput = document.getElementById('imageInput');
const generateBtn = document.getElementById('generateBtn');
const downloadLink = document.getElementById('downloadLink');
const outputSection = document.querySelector('.output-section');
const dropZone = document.querySelector('.drop-zone');
const dropZonePrompt = document.querySelector('.drop-zone__prompt');

// Event Listeners
generateBtn.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', handleImageUpload);

// Drag and Drop Events
dropZone.addEventListener('click', (e) => {
    if (e.target === dropZone || e.target === dropZonePrompt) {
        imageInput.click();
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drop-zone--over');
});

['dragleave', 'dragend'].forEach(type => {
    dropZone.addEventListener(type, () => {
        dropZone.classList.remove('drop-zone--over');
    });
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drop-zone--over');
    
    if (e.dataTransfer.files.length) {
        handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
});

function updateThumbnail(file, element) {
    if (file.type.startsWith('image/')) {
        element.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        element.dataset.label = file.name;
    } else {
        element.textContent = 'Invalid file type';
        element.style.backgroundImage = '';
        element.dataset.label = '';
    }
}

async function handleImageUpload(event) {
    const file = event.target.files[0] || event.dataTransfer?.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    // Update drop zone with thumbnail
    dropZonePrompt.style.display = 'none';
    if (!dropZone.querySelector('.drop-zone__thumb')) {
        dropZone.innerHTML = `<div class="drop-zone__thumb" data-label="${file.name}"></div>`;
    }
    updateThumbnail(file, dropZone.querySelector('.drop-zone__thumb'));

    try {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        
        const image = await loadImage(file);
        const zip = new JSZip();
        const iconsFolder = zip.folder("AppIcon.appiconset");
        
        // Generate icons
        const contents = {
            images: [],
            info: {
                version: 1,
                author: "web-icon-generator"
            }
        };

        for (const spec of ICON_SIZES) {
            const [width, height] = spec.size.split('x').map(Number);
            const scale = parseInt(spec.scale);
            const canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;
            
            const ctx = canvas.getContext('2d');
            
            // Fill white background first
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Then draw the image on top
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            
            const filename = `icon-${width}${scale > 1 ? `@${scale}x` : ''}${spec.idiom === 'ipad' ? '-ipad' : ''}.png`;
            const blob = await canvasToBlob(canvas);
            
            iconsFolder.file(filename, blob);
            contents.images.push({
                ...spec,
                filename: filename
            });
        }

        // Add Contents.json
        iconsFolder.file("Contents.json", JSON.stringify(contents, null, 2));
        
        // Generate ZIP
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadLink.href = URL.createObjectURL(zipBlob);
        downloadLink.download = "AppIcons.zip";
        
        outputSection.classList.remove('hidden');
    } catch (error) {
        console.error('Error generating icons:', error);
        alert('Error generating icons. Please try again.');
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Icons';
    }
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

function canvasToBlob(canvas) {
    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
    });
}

// Load required libraries
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize
Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js')
]).catch(error => {
    console.error('Failed to load required libraries:', error);
    alert('Failed to load required resources. Please try again.');
});