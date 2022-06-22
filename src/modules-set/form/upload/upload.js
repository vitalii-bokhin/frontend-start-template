; var getUploadData, getUploadError;

(function () {
    'use strict';

    let isUploadError = false;
    let preparedFiles = [];
    let previewItems = [];
    const state = {
        uploadFiles: {
            status: 'idle',
            count: 0,
            items: []
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const fileInp = document.getElementById('upload-input-2142');

        fileInp.addEventListener('change', changeInput);

        document.addEventListener('click', function (e) {
            const delBtn = e.target.closest('.upload-form__files-delete');

            if (delBtn) {
                deleteFile(delBtn.getAttribute('data-name'));
            }
        });

        updateState();
        dropAreaRefUe();
        dropAreaRefTwoUe();
    });

    const setPerviewItems = function (items) {
        previewItems = items;

        updateState();
    }

    // reducers
    function addUploadFiles(action) {
        const files = [];

        for (const file of action) {
            files.push({
                file,
                name: file.name,
                view: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMzAwcHgiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDAgMzAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxyZWN0IGZpbGw9IiNCOEQ4RkYiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIi8+DQo8cG9seWdvbiBmaWxsPSIjN0M3QzdDIiBwb2ludHM9IjUxLDI2Ny42NjY5OTIyIDExMSwxOTcgMTUxLDI0My42NjY5OTIyIDI4OC4zMzMwMDc4LDEyMSAzMDAuMTY2OTkyMiwxMzQuMTY2NTAzOSAzMDAsMzAwIDAsMzAwIA0KCTAsMjA4LjgzMzk4NDQgIi8+DQo8cG9seWdvbiBmaWxsPSIjQUZBRkFGIiBwb2ludHM9IjAuMTI1LDI2Ny4xMjUgNDguODMzNDk2MSwxNzQuNjY2OTkyMiAxMDMuNSwyNjQuNSAyMDMuODc1LDY1LjMzMzAwNzggMzAwLjE2Njk5MjIsMjU0LjUgMzAwLDMwMCANCgkwLDMwMCAiLz4NCjxjaXJjbGUgZmlsbD0iI0VBRUFFQSIgY3g9Ijc3LjAwMDI0NDEiIGN5PSI3MSIgcj0iMzYuNjY2NzQ4Ii8+DQo8L3N2Zz4NCg=='
            });
        }

        state.uploadFiles.items = state.uploadFiles.items.concat(files);

        if (state.uploadFiles.items.length) {
            state.uploadFiles.status = 'prepared';
            state.uploadFiles.count = state.uploadFiles.items.length;
        }

        preparedFiles = state.uploadFiles.items;
        preparedFilesUe();
    }

    function addUploadView(action) {
        state.uploadFiles.items.forEach(function (item, i) {
            if (item.name === action.name && /image.*?/i.test(item.file.type)) {
                state.uploadFiles.items[i].view = action.view;
            }
        });

        preparedFiles = state.uploadFiles.items;
        preparedFilesUe();
    }

    function deleteFile(action) {
        state.uploadFiles.items.forEach(function (item, i) {
            if (item.name === action) {
                state.uploadFiles.items.splice(i, 1);

                if (!state.uploadFiles.items.length) {
                    state.uploadFiles.status = 'idle';
                }

                state.uploadFiles.count = state.uploadFiles.items.length;
            }
        });

        preparedFiles = state.uploadFiles.items;
        preparedFilesUe();
    }

    // component
    const addView = function (files) {
        for (const file of files) {
            const reader = new FileReader();

            reader.onload = function (e) {
                addUploadView({
                    name: file.name,
                    view: e.target.result,
                });
            };

            reader.readAsDataURL(file);
        }
    };

    const onDragsHandler = (e, dropEl) => {
        e.preventDefault();
        e.stopPropagation();
        dropEl.classList.add('highlight');
    };

    const onDragLeaveHandler = (e, dropEl) => {
        e.preventDefault();
        e.stopPropagation();
        dropEl.classList.remove('highlight');
    };

    const onDropHandler = (e, dropEl) => {
        e.preventDefault();
        e.stopPropagation();
        dropEl.classList.remove('highlight');

        addUploadFiles(e.dataTransfer.files);
        addView(e.dataTransfer.files);
    };

    function dropAreaRefUe() {
        const dropEl = document.getElementById('dropAreaRef');

        if (!dropEl) {
            return;
        }

        ['dragenter', 'dragover'].forEach((eventName) => {
            dropEl.addEventListener(eventName, (e) => onDragsHandler(e, dropEl));
        });

        dropEl.addEventListener('dragleave', (e) => onDragLeaveHandler(e, dropEl));
        dropEl.addEventListener('drop', (e) => onDropHandler(e, dropEl));

        return () => {
            ['dragenter', 'dragover'].forEach((eventName) => {
                dropEl.removeEventListener(eventName, onDragsHandler);
            });

            dropEl.removeEventListener('dragleave', onDragLeaveHandler);
            dropEl.removeEventListener('drop', onDropHandler);
        };
    }

    function dropAreaRefTwoUe() {
        const dropEl = document.getElementById('dropAreaRefTwo');

        if (!dropEl) {
            return;
        }

        ['dragenter', 'dragover'].forEach((eventName) => {
            dropEl.addEventListener(eventName, (e) => onDragsHandler(e, dropEl));
        });

        dropEl.addEventListener('dragleave', (e) => onDragLeaveHandler(e, dropEl));
        dropEl.addEventListener('drop', (e) => onDropHandler(e, dropEl));

        return () => {
            ['dragenter', 'dragover'].forEach((eventName) => {
                dropEl.removeEventListener(eventName, onDragsHandler);
            });

            dropEl.removeEventListener('dragleave', onDragLeaveHandler);
            dropEl.removeEventListener('drop', onDropHandler);
        };
    }

    function preparedFilesUe() {
        if (!!preparedFiles.length) {
            setPerviewItems(
                preparedFiles.map(item => {
                    const errors = [];
                    let error = '';

                    if (!/image.*?/i.test(item.file.type)) {
                        errors.push('The file must be an image (jpg, jpeg, png, gif).');
                    }

                    if (item.file.size > 2000000) {
                        errors.push('The file size must be less than 2Mb.');
                    }


                    if (errors.length) {
                        error = '<span class="upload-form__files-error">' + errors.join(' ') + '</span>';
                        isUploadError = true;
                    } else {
                        isUploadError = false;
                    }

                    return `<span class="upload-form__files-item">
                            <span class="upload-form__files-inner">
                                <img src=${item.view} alt="img" />
                                ${error}
                                <button class="upload-form__files-delete" data-name="${item.name}"></button>
                            </span>
                        </span>`;
                })
            )
        } else {
            setPerviewItems([]);
        }
    }

    function changeInput(e) {
        addUploadFiles(e.target.files);
        addView(e.target.files);
    };

    function updateState() {
        const uploadFormFiles = document.querySelector('.upload-form__files');
        const uploadFormFilesPpreviews = document.querySelector('.upload-form__files-previews');
        const dropEl = document.getElementById('dropAreaRef');

        if (previewItems.length > 0) {
            uploadFormFiles.classList.add('upload-form__files_visible');
            uploadFormFilesPpreviews.innerHTML = previewItems.join('');
            dropEl.classList.add('upload-form__label_hide-cloud');
        } else {
            uploadFormFiles.classList.remove('upload-form__files_visible');
        }
    }

    getUploadData = function () {
        return preparedFiles;
    }

    getUploadError = function () {
        return isUploadError;
    }
})();
