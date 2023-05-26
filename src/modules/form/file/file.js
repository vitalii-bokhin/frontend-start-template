; var CustomFile;

(function () {
    'use strict';

    //custom file
    CustomFile = function (opt) {
        this.opt = opt || {};
        this.input = null;
        this.filesObj = {};
        this.filesArrayObj = {};
        this.filesIsReady = null;
        this.previewItem = null;
        this.toUpload = [];
        this.toRemove = [];

        this.init = function () {
            if (this.opt.previewItem) this.previewItem = this.opt.previewItem;

            document.addEventListener('change', (e) => {
                const elem = e.target.closest(this.opt.inputSelector);

                if (!elem) return;

                this.input = elem;

                this.changeInput(elem);
            });

            document.addEventListener('click', (e) => {
                const delBtnElem = e.target.closest('.custom-file__del-btn'),
                    clearBtnElem = e.target.closest('.custom-file__clear-btn'),
                    inputElem = e.target.closest(this.opt.inputSelector);

                if (inputElem && inputElem.multiple) inputElem.value = null;

                if (delBtnElem) {
                    delBtnElem.closest(this.opt.previewsContainer).removeChild(delBtnElem.closest('div'));

                    this.setFilesObj(false, delBtnElem.getAttribute('data-name'));

                    if (this.filesDeleted) this.filesDeleted(this.input);
                }

                if (clearBtnElem) {
                    const inputElem = clearBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    inputElem.value = null;

                    this.clear(inputElem);
                }
            });
        }

        this.clear = function (inpEl, resetVal) {
            if (inpEl.hasAttribute('data-preview-elem')) {
                document.querySelector(inpEl.getAttribute('data-preview-elem')).innerHTML = '';
            }

            const itemsEl = inpEl.closest('.custom-file').querySelector('.custom-file__items');

            if (itemsEl) {
                itemsEl.innerHTML = '';
            }

            if (resetVal !== false) inpEl.value = null;

            this.filesObj[inpEl.id] = {};
            this.filesArrayObj[inpEl.id] = [];

            this.labelText(inpEl);
        }

        this.fieldClass = function (inputElem) {
            const fieldElem = inputElem.closest('.custom-file');

            if (this.filesArrayObj[inputElem.id].length) {
                fieldElem.classList.add('custom-file_loaded');

                if (this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
                    fieldElem.classList.add('custom-file_max-loaded');
                } else {
                    fieldElem.classList.remove('custom-file_max-loaded');
                }
            } else {
                fieldElem.classList.remove('custom-file_loaded');
                fieldElem.classList.remove('custom-file_max-loaded');
            }
        }

        this.lockUpload = function (inputElem) {
            if (inputElem.classList.contains('custom-file__input_lock') && inputElem.multiple && inputElem.hasAttribute('data-max-files') && this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
                inputElem.setAttribute('disabled', 'disable');
            } else {
                inputElem.removeAttribute('disabled');
            }
        }

        this.labelText = function (inputElem) {
            const labTxtElem = inputElem.closest('.custom-file').querySelector('.custom-file__label-text');

            if (!labTxtElem || !labTxtElem.hasAttribute('data-label-text-2')) {
                return;
            }

            const maxFiles = (inputElem.multiple) ? (+this.input.getAttribute('data-max-files')) : 1;

            if (this.filesArrayObj[inputElem.id].length >= maxFiles) {
                if (!labTxtElem.hasAttribute('data-label-text')) {
                    labTxtElem.setAttribute('data-label-text', labTxtElem.innerHTML);
                }

                if (labTxtElem.getAttribute('data-label-text-2') == '%filename%') {
                    labTxtElem.innerHTML = inputElem.files[0].name;
                } else {
                    labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text-2');
                }

            } else if (labTxtElem.hasAttribute('data-label-text')) {
                labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text');
            }
        }

        this.loadPreview = function (file) {
            var reader = new FileReader();
            var previewImgEl;

            setTimeout(() => {
                if (this.input.hasAttribute('data-preview-elem')) {
                    previewImgEl = document.querySelector(this.input.getAttribute('data-preview-elem'));
                } else {
                    previewImgEl = document.querySelector(this.opt.previewsContainer + ' img[data-preview-image="' + file.name + '"]');
                }

                console.log(previewImgEl);

                reader.onload = function (e) {
                    previewImgEl.setAttribute('src', e.target.result);
                }

                reader.readAsDataURL(file);
            }, 121);
        }

        this.changeInput = function (elem) {
            var fileItems = document.querySelector(this.opt.previewsContainer);

            if (elem.getAttribute('data-action') == 'clear' || !elem.multiple) {
                this.clear(elem, false);
            }

            for (var i = 0; i < elem.files.length; i++) {
                var file = elem.files[i];

                if (this.filesObj[elem.id] && this.filesObj[elem.id][file.name] != undefined) continue;

                var fileNameSplit = file.name.split('.');
                var fileItem = this.previewItem({
                    name: file.name,
                    ext: fileNameSplit.slice(-1)[0],
                });

                if (fileItems) {
                    // fileItems.appendChild(fileItem);
                    fileItems.insertAdjacentHTML('beforeend', fileItem);
                    this.loadPreview(file);
                }

            }

            this.setFilesObj(elem.files);

            if (this.filesIsReady) {
                this.filesIsReady(elem);
            }
        }

        this.setFilesObj = function (filesList, deleteName) {
            // var inputElem = this.input;

            // if (!inputElem.id.length) {
            //     inputElem.id = 'custom-file-input-' + new Date().valueOf();
            // }

            if (filesList) {
                // this.filesObj[inputElem.id] = this.filesObj[inputElem.id] || {};

                for (var i = 0; i < filesList.length; i++) {
                    // this.filesObj[inputElem.id][filesList[i].name] = filesList[i];
                    this.toUpload.push(filesList[i]);
                }
            } else {
                // delete this.filesObj[inputElem.id][objKey];

                const toUploadNames = this.toUpload.map((item) => item.name);

                if (!toUploadNames.includes(deleteName)) {
                    this.toRemove.push(deleteName);
                }

                this.toUpload = this.toUpload.filter((item) => item.name !== deleteName);
            }

            // this.filesArrayObj[inputElem.id] = [];

            // for (var key in this.filesObj[inputElem.id]) {
            //     this.filesArrayObj[inputElem.id].push(this.filesObj[inputElem.id][key]);
            // }

            // this.fieldClass(inputElem);
            // this.labelText(inputElem);
            // this.lockUpload(inputElem);
            // ValidateForm.file(inputElem, this.filesArrayObj[inputElem.id]);
        }

        this.inputFiles = function (inputElem) {
            return this.filesArrayObj[inputElem.id] || [];
        }

        this.getFiles = function (formElem) {
            var inputFileElements = formElem.querySelectorAll('.custom-file__input'),
                filesArr = [];

            if (inputFileElements.length == 1) {
                filesArr = this.filesArrayObj[inputFileElements[0].id];
            } else {
                for (var i = 0; i < inputFileElements.length; i++) {
                    if (this.filesArrayObj[inputFileElements[i].id]) {
                        filesArr.push({
                            name: inputFileElements[i].name,
                            files: this.filesArrayObj[inputFileElements[i].id],
                        });
                    }
                }
            }

            return filesArr;
        }
    }

    //init script

    const cfile = new CustomFile({
        inputSelector: 'input[type="file"]',
        previewsContainer: '.files-wrapper',
        previewItem: (item) => {
            return `<div>
                        <button class="custom-file__del-btn" data-name="${item.name}"></button>
                        <img src="" alt="img" data-preview-image="${item.name}">
                        <span>${item.name}</span>
                        <span>${item.ext}</span>
                    </div>`;
        }
    });
    console.log('new CustomFile');
    cfile.init();

})();