<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Compressor Pro</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <style>
        :root {
            --bg-primary: #0a0d14;
            --bg-secondary: #1a1f2e;
            --text-primary: #ffffff;
            --text-secondary: #8b95a9;
            --accent: #3498db;
            --accent-hover: #2980b9;
            --danger: #e74c3c;
            --border: #2c3547;
            --success: #2ecc71;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, system-ui, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            padding: 2rem;
        }

        .container {
            max-width: 1000px;
            margin: 2rem auto;
            background: var(--bg-secondary);
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }

        h1 {
            text-align: center;
            margin-bottom: 2rem;
            color: var(--text-primary);
            font-size: 2.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .upload-box {
            border: 2px dashed var(--border);
            padding: 3.5rem;
            background: rgba(52, 152, 219, 0.05);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: center;
            margin-bottom: 2rem;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .upload-box:hover {
            border-color: var(--accent);
            background: rgba(52, 152, 219, 0.1);
            transform: translateY(-2px);
        }

        .upload-box.dragover {
            border-color: var(--accent);
            background: rgba(76, 175, 80, 0.2);
        }

        .controls {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        button {
            padding: 0.75rem 1.75rem;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
        }

        button:hover {
            background: var(--accent-hover);
            transform: translateY(-1px);
        }

        button.delete-btn {
            background: var(--danger);
        }

        button.delete-btn:hover {
            background: #ff1111;
        }

        .image-item {
            display: flex;
            align-items: center;
            padding: 1.25rem;
            background: var(--bg-primary);
            margin-bottom: 1rem;
            border-radius: 8px;
            gap: 1rem;
            transition: transform 0.3s ease, opacity 0.3s ease;
            border: 1px solid var(--border);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .image-item img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
        }

        .image-info {
            flex-grow: 1;
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            background: var(--border);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 0.5rem;
        }

        .progress {
            width: 0%;
            height: 100%;
            background: var(--accent);
            transition: width 0.3s ease;
        }

        input[type="text"], select {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            padding: 0.75rem 1rem;
            border-radius: 8px;
            color: var(--text-primary);
            transition: all 0.3s ease;
            width: 200px;
        }

        input[type="text"]:focus, select:focus {
            border-color: var(--accent);
            outline: none;
        }

        .quality-control {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 0.5rem;
        }

        .quality-slider {
            flex: 1;
            height: 6px;
            appearance: none;
            background: var(--border);
            border-radius: 3px;
        }

        .quality-slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background: var(--accent);
            border-radius: 50%;
            cursor: pointer;
        }

        .quality-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: var(--accent);
            border-radius: 50%;
            border: none;
            cursor: pointer;
        }

        .move-buttons {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .move-buttons button {
            padding: 0.25rem 0.5rem;
            font-size: 1rem;
        }

        .move-buttons button {
            padding: 0.5rem;
            background: transparent;
            border: 1px solid;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .move-up-btn {
            border-color: #8e44ad !important;
            color: #8e44ad !important;
        }

        .move-down-btn {
            border-color: #2980b9 !important;
            color: #2980b9 !important;
        }

        .move-up-btn:hover {
            background: #8e44ad !important;
            color: white !important;
        }

        .move-down-btn:hover {
            background: #2980b9 !important;
            color: white !important;
        }

        .quality-control {
            background: var(--bg-primary);
            padding: 0.75rem;
            border-radius: 6px;
            margin-top: 0.75rem;
        }

        .quality-control label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .quality-value {
            display: inline-block;
            min-width: 3em;
            text-align: right;
            margin-left: 0.5rem;
            color: var(--accent);
            font-weight: bold;
        }

        .quality-slider {
            width: 100%;
            margin: 0.5rem 0;
        }

        .zip-name-container {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .zip-name-container label {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .image-item {
            opacity: 1;
            position: relative;
            transform: translateY(0);
            transition: transform 0.3s ease, opacity 0.3s ease;
            will-change: transform;
        }

        .image-item.moving {
            z-index: 2;
            pointer-events: none;
        }

        .image-item.moving-up {
            transform: translateY(-100%);
        }

        .image-item.moving-down {
            transform: translateY(100%);
        }

        .image-select {
            margin-right: 10px;
            transform: scale(1.2);
        }

        #moveToTopBtn {
            background: var(--accent);
            display: none;
            margin-left: auto;
        }

        #moveToTopBtn:hover {
            background: var(--accent-hover);
        }

        .image-item {
            transition: transform 0.3s ease-in-out;
            will-change: transform;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Image Compressor Pro</h1>
        
        <div class="settings-panel">
            <div class="controls">
                <div class="zip-name-container">
                    <label for="zipName">Rename ZIP File:</label>
                    <input type="text" 
                        id="zipName" 
                        placeholder="Enter ZIP file name" 
                        value="compressed-images">
                </div>
                <button id="renameBtn">Rename Images</button>
                <button id="compressBtn">Compress All</button>
                <select id="defaultFormat" onchange="updateAllFormats(this.value)">
                    <option value="image/jpeg">.jpg</option>
                    <option value="image/png">.png</option>
                    <option value="image/webp">.webp</option>
                </select>
                <button id="moveToTopBtn">Move Selected to Top</button>
            </div>
        </div>

        <div class="upload-box" id="uploadBox">
            <p>Drag & drop images here or click to select</p>
            <input type="file" id="fileInput" multiple accept="image/*" style="display: none">
        </div>

        <div class="image-list" id="imageList"></div>
    </div>

    <script>
        let images = [];
        const uploadBox = document.getElementById('uploadBox');
        const fileInput = document.getElementById('fileInput');
        const imageList = document.getElementById('imageList');
        const renameBtn = document.getElementById('renameBtn');
        const compressBtn = document.getElementById('compressBtn');
        const zipNameInput = document.getElementById('zipName');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, preventDefaults);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadBox.addEventListener(eventName, () => {
                uploadBox.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, () => {
                uploadBox.classList.remove('dragover');
            });
        });

        uploadBox.addEventListener('drop', handleDrop);
        uploadBox.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFiles);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles({ target: { files } });
        }

        function handleFiles(e) {
            const files = [...e.target.files];
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    images.push({
                        file,
                        name: file.name,
                        customName: '',
                        compressed: false,
                        progress: 0,
                        quality: 0.9
                    });
                }
            });
            updateImageList();
        }

        function updateImageList() {
            const oldItems = document.querySelectorAll('.image-item');
            const checkedStates = Array.from(oldItems).map(item => 
                item.querySelector('.image-select')?.checked || false
            );

            imageList.innerHTML = '';
            images.forEach((image, index) => {
                const div = document.createElement('div');
                div.className = 'image-item';

                const reader = new FileReader();
                reader.onload = e => {
                    div.innerHTML = `
                        <input type="checkbox" class="image-select" onchange="updateDeleteButton()">
                        <img src="${e.target.result}" alt="${image.name}">
                        <div class="image-info">
                            <input type="text" class="custom-name" value="${image.customName || image.name}" placeholder="Custom name">
                            <div>${formatSize(image.file.size)}</div>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${image.progress}%"></div>
                            </div>
                            <div class="quality-control">
                                <label>Image Quality <span class="quality-value">${Math.round(image.quality * 100)}%</span></label>
                                <input type="range" 
                                    class="quality-slider" 
                                    min="10" 
                                    max="100" 
                                    value="${Math.round(image.quality * 100)}"
                                    oninput="updateQualitySmooth(this, ${index})">
                            </div>
                        </div>
                        <select class="format-select">
                            <option value="image/jpeg">.jpg</option>
                            <option value="image/png">.png</option>
                            <option value="image/webp">.webp</option>
                        </select>
                        <div class="move-buttons">
                            ${index > 0 ? `<button class="move-up-btn" onclick="moveImageSmooth(${index}, 'up')">↑</button>` : ''}
                            ${index < images.length - 1 ? `<button class="move-down-btn" onclick="moveImageSmooth(${index}, 'down')">↓</button>` : ''}
                        </div>
                        <button class="delete-btn" onclick="deleteImage(${index})">×</button>
                    `;
                };
                reader.readAsDataURL(image.file);
                imageList.appendChild(div);
            });

            // Restore checkbox states
            const newItems = document.querySelectorAll('.image-item');
            checkedStates.forEach((checked, index) => {
                if (newItems[index]) {
                    newItems[index].querySelector('.image-select').checked = checked;
                }
            });

            updateCompressButton();
        }

        let isUpdating = false;

        function updateQualitySmooth(slider, index) {
            if (isUpdating) return;
            
            const value = parseInt(slider.value);
            const qualityValue = slider.parentElement.querySelector('.quality-value');
            qualityValue.textContent = value + '%';
            
            // Debounce the actual update
            clearTimeout(slider.timeout);
            slider.timeout = setTimeout(() => {
                images[index].quality = value / 100;
            }, 100);
        }

        function moveImageSmooth(index, direction) {
            const imageList = document.getElementById('imageList');
            const items = Array.from(imageList.children);
            const currentItem = items[index];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            
            if (targetIndex < 0 || targetIndex >= items.length) return;
            
            const targetItem = items[targetIndex];
            const itemHeight = currentItem.offsetHeight;

            // Set initial states
            currentItem.style.zIndex = '2';
            targetItem.style.zIndex = '1';
            
            // Apply transitions
            currentItem.style.transform = direction === 'up' 
                ? `translateY(-${itemHeight}px)` 
                : `translateY(${itemHeight}px)`;
            
            targetItem.style.transform = direction === 'up' 
                ? `translateY(${itemHeight}px)` 
                : `translateY(-${itemHeight}px)`;

            // Swap array elements
            [images[index], images[targetIndex]] = [images[targetIndex], images[index]];

            // After animation
            setTimeout(() => {
                // Reset transforms
                currentItem.style.transform = '';
                targetItem.style.transform = '';
                currentItem.style.zIndex = '1';
                targetItem.style.zIndex = '1';

                // Update DOM
                if (direction === 'up') {
                    imageList.insertBefore(currentItem, targetItem);
                } else {
                    imageList.insertBefore(targetItem, currentItem);
                }
            }, 300);
        }

        function updateCompressButton() {
            compressBtn.textContent = images.length > 1 ? 'Compress to ZIP' : 'Compress Image';
        }

        renameBtn.addEventListener('click', () => {
            images.forEach((image, index) => {
                const customInput = imageList.children[index].querySelector('.custom-name');
                image.customName = `${index + 1}`;
                customInput.value = image.customName;
            });
        });

        compressBtn.addEventListener('click', async () => {
            if (images.length === 0) return;

            if (images.length === 1) {
                const image = images[0];
                const format = imageList.querySelector('.format-select').value;
                const ext = format.split('/')[1];
                const compressedBlob = await compressImage(image.file, format, image.quality, (progress) => {
                    image.progress = progress;
                    imageList.querySelector('.progress').style.width = `${progress}%`;
                });
                
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(compressedBlob);
                downloadLink.download = `${image.customName || image.name.split('.')[0]}.${ext}`;
                downloadLink.click();
                return;
            }

            const zip = new JSZip();
            
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const format = imageList.children[i].querySelector('.format-select').value;
                const ext = format.split('/')[1];
                
                try {
                    const compressedBlob = await compressImage(image.file, format, image.quality, (progress) => {
                        image.progress = progress;
                        imageList.children[i].querySelector('.progress').style.width = `${progress}%`;
                    });
                    
                    const fileName = image.customName || `${image.name.split('.')[0]}.${ext}`;
                    zip.file(fileName, compressedBlob);
                    image.compressed = true;
                } catch (err) {
                    console.error('Compression failed:', err);
                }
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(zipBlob);
            downloadLink.download = `${zipNameInput.value || 'compressed-images'}.zip`;
            downloadLink.click();
        });

        async function compressImage(file, format, quality, progressCallback) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;
                    
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        progressCallback(50);
                        
                        canvas.toBlob((blob) => {
                            progressCallback(100);
                            resolve(blob);
                        }, format, quality);
                    };
                };
            });
        }

        function formatSize(bytes) {
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Bytes';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
        }

        function updateAllFormats(format) {
            const formatSelects = document.querySelectorAll('.format-select');
            formatSelects.forEach(select => {
                select.value = format;
            });
        }

        function deleteImage(index) {
            images.splice(index, 1);
            updateImageList();
        }

        function moveImage(index, direction) {
            if (direction === 'up' && index > 0) {
                [images[index], images[index - 1]] = [images[index - 1], images[index]];
            } else if (direction === 'down' && index < images.length - 1) {
                [images[index], images[index + 1]] = [images[index + 1], images[index]];
            }
            updateImageList();
        }

        const style = document.createElement('style');
        style.textContent = `
            .move-buttons {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            .move-buttons button {
                padding: 0.25rem 0.5rem;
                font-size: 1rem;
            }
        `;
        document.head.appendChild(style);

        // Update CSS for smoother transitions
        function addTransitionStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .image-item {
                    opacity: 1;
                    position: relative;
                    transform: translateY(0);
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    will-change: transform;
                }

                .image-item.moving {
                    z-index: 2;
                    pointer-events: none;
                }

                .image-item.moving-up {
                    transform: translateY(-100%);
                }

                .image-item.moving-down {
                    transform: translateY(100%);
                }

                .image-select {
                    margin-right: 10px;
                    transform: scale(1.2);
                }
            `;
            document.head.appendChild(style);
        }

        // Call this function when the page loads
        document.addEventListener('DOMContentLoaded', addTransitionStyles);

        // Update the CSS for smoother transitions
        const transitionStyles = `
            .image-item {
                opacity: 1;
                will-change: transform;
                transition: transform 0.3s ease-in-out;
            }

            .image-item img {
                pointer-events: none; /* Prevent image dragging during animation */
            }

            .move-up-btn,
            .move-down-btn {
                transition: opacity 0.2s ease-in-out;
            }

            .image-item.moving {
                pointer-events: none;
            }
        `;

        // Add the styles to the document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = transitionStyles;
        document.head.appendChild(styleSheet);

        function updateControlButtons() {
            const selectedCount = document.querySelectorAll('.image-select:checked').length;
            let moveToTopBtn = document.getElementById('moveToTopBtn');
            
            if (!moveToTopBtn) {
                moveToTopBtn = document.createElement('button');
                moveToTopBtn.id = 'moveToTopBtn';
                moveToTopBtn.onclick = moveSelectedToTop;
                document.querySelector('.controls').appendChild(moveToTopBtn);
            }
            
            moveToTopBtn.textContent = `Move ${selectedCount} Selected to Top`;
            moveToTopBtn.style.display = selectedCount > 0 ? 'block' : 'none';
        }

        function moveSelectedToTop() {
            const imageList = document.getElementById('imageList');
            const items = Array.from(imageList.children);
            const selectedItems = items.filter(item => item.querySelector('.image-select:checked'));
            
            if (selectedItems.length === 0) return;

            // Calculate positions for animation
            const itemPositions = selectedItems.map(item => {
                const rect = item.getBoundingClientRect();
                return {
                    element: item,
                    startY: rect.top,
                    height: rect.height
                };
            });

            // Mark selected items
            selectedItems.forEach(item => item.style.zIndex = '2');

            // Calculate target positions
            let currentTop = items[0].getBoundingClientRect().top;
            itemPositions.forEach((pos, index) => {
                const targetY = currentTop - pos.startY;
                pos.element.style.transform = `translateY(${targetY}px)`;
                currentTop += pos.height;
            });

            // After animation, update DOM
            setTimeout(() => {
                // Reset transforms
                selectedItems.forEach(item => {
                    item.style.transform = '';
                    item.style.zIndex = '1';
                });

                // Move items to top
                selectedItems.reverse().forEach(item => {
                    imageList.insertBefore(item, imageList.firstChild);
                });

                // Update array order
                const newImages = [];
                Array.from(imageList.children).forEach(item => {
                    const index = items.indexOf(item);
                    newImages.push(images[index]);
                });
                images = newImages;
            }, 300);
        }

        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('image-select')) {
                updateControlButtons();
            }
        });

        function moveImageGroupUp(indices) {
            if (indices.length === 0 || Math.min(...indices) <= 0) return;

            const items = document.querySelectorAll('.image-item');
            const itemHeight = items[0].offsetHeight;

            // Move all selected images up one position
            indices.sort((a, b) => a - b).forEach(idx => {
                const currentItem = items[idx];
                const targetItem = items[idx - 1];
                
                if (!currentItem || !targetItem || indices.includes(idx - 1)) return;

                currentItem.style.transition = 'transform 0.3s ease-in-out';
                targetItem.style.transition = 'transform 0.3s ease-in-out';
                
                currentItem.style.transform = `translateY(-${itemHeight}px)`;
                targetItem.style.transform = `translateY(${itemHeight}px)`;

                // Swap in array
                [images[idx], images[idx - 1]] = [images[idx - 1], images[idx]];
            });

            // After animation, update DOM
            setTimeout(() => {
                indices.forEach(idx => {
                    const currentItem = items[idx];
                    const targetItem = items[idx - 1];
                    
                    if (!currentItem || !targetItem || indices.includes(idx - 1)) return;

                    currentItem.style.transition = '';
                    targetItem.style.transition = '';
                    currentItem.style.transform = '';
                    targetItem.style.transform = '';

                    targetItem.parentNode.insertBefore(currentItem, targetItem);
                });
                updateImageList();
            }, 300);
        }

        // Add this button to your HTML controls section if not already present
        // <button id="moveToTopBtn" style="display: none;">Move Selected to Top</button>

        // Replace or add these functions
        function initializeControls() {
            const moveToTopBtn = document.getElementById('moveToTopBtn');
            moveToTopBtn.addEventListener('click', moveSelectedToTop);

            // Add checkbox change listener
            document.addEventListener('change', (e) => {
                if (e.target.classList.contains('image-select')) {
                    updateMoveToTopButton();
                }
            });
        }

        function updateMoveToTopButton() {
            const moveToTopBtn = document.getElementById('moveToTopBtn');
            const selectedCount = document.querySelectorAll('.image-select:checked').length;
            moveToTopBtn.style.display = selectedCount > 0 ? 'block' : 'none';
            moveToTopBtn.textContent = `Move ${selectedCount} Selected to Top`;
        }

        function moveSelectedToTop() {
            const imageList = document.getElementById('imageList');
            const items = Array.from(imageList.children);
            const selectedItems = items.filter(item => item.querySelector('.image-select:checked'));
            
            if (selectedItems.length === 0) return;

            // Calculate positions for animation
            const itemPositions = selectedItems.map(item => {
                const rect = item.getBoundingClientRect();
                return {
                    element: item,
                    startY: rect.top,
                    height: rect.height
                };
            });

            // Mark selected items
            selectedItems.forEach(item => item.style.zIndex = '2');

            // Calculate target positions
            let currentTop = items[0].getBoundingClientRect().top;
            itemPositions.forEach((pos, index) => {
                const targetY = currentTop - pos.startY;
                pos.element.style.transform = `translateY(${targetY}px)`;
                currentTop += pos.height;
            });

            // After animation, update DOM
            setTimeout(() => {
                // Reset transforms
                selectedItems.forEach(item => {
                    item.style.transform = '';
                    item.style.zIndex = '1';
                });

                // Move items to top
                selectedItems.reverse().forEach(item => {
                    imageList.insertBefore(item, imageList.firstChild);
                });

                // Update array order
                const newImages = [];
                Array.from(imageList.children).forEach(item => {
                    const index = items.indexOf(item);
                    newImages.push(images[index]);
                });
                images = newImages;
            }, 300);
        }

        function moveImageSmooth(index, direction) {
            const imageList = document.getElementById('imageList');
            const items = Array.from(imageList.children);
            const currentItem = items[index];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            
            if (targetIndex < 0 || targetIndex >= items.length) return;
            
            const targetItem = items[targetIndex];
            const itemHeight = currentItem.offsetHeight;

            // Set initial states
            currentItem.style.zIndex = '2';
            targetItem.style.zIndex = '1';
            
            // Apply transitions
            currentItem.style.transform = direction === 'up' 
                ? `translateY(-${itemHeight}px)` 
                : `translateY(${itemHeight}px)`;
            
            targetItem.style.transform = direction === 'up' 
                ? `translateY(${itemHeight}px)` 
                : `translateY(-${itemHeight}px)`;

            // Swap array elements
            [images[index], images[targetIndex]] = [images[targetIndex], images[index]];

            // After animation
            setTimeout(() => {
                // Reset transforms
                currentItem.style.transform = '';
                targetItem.style.transform = '';
                currentItem.style.zIndex = '1';
                targetItem.style.zIndex = '1';

                // Update DOM
                if (direction === 'up') {
                    imageList.insertBefore(currentItem, targetItem);
                } else {
                    imageList.insertBefore(targetItem, currentItem);
                }
            }, 300);
        }

        // Add these styles to your CSS
        const styles = `
            .image-item {
                transform: translateY(0);
                transition: transform 0.3s ease-in-out;
                will-change: transform;
                position: relative;
                z-index: 1;
            }

            #moveToTopBtn {
                background: var(--accent);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                display: none;
                margin-left: auto;
            }

            #moveToTopBtn:hover {
                background: var(--accent-hover);
            }
        `;

        // Add the styles to the document
        if (!document.getElementById('movement-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'movement-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        // Initialize controls when the document is ready
        document.addEventListener('DOMContentLoaded', initializeControls);
    </script>
</body>
</html>
