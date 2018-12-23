; var CustomFile;

(function() {
	'use strict';
	
	//custom file
	CustomFile = {
		input: null,
		filesObj: {},
		filesArrayObj: {},
		
		clear: function(elem) {
			if (elem.hasAttribute('data-preview-elem')) {
				document.querySelector(elem.getAttribute('data-preview-elem')).innerHTML = '';
			}

			elem.closest('.custom-file').querySelector('.custom-file__items').innerHTML = '';
			
			this.filesObj[elem.id] = {};
			this.filesArrayObj[elem.id] = [];
		},
		
		loadPreview: function(file, fileItem) {
			var reader = new FileReader(),
			previewDiv;
			
			if (this.input.hasAttribute('data-preview-elem')) {
				previewDiv = document.querySelector(this.input.getAttribute('data-preview-elem'));
			} else {
				previewDiv = document.createElement('div');
				
				previewDiv.className = 'custom-file__preview';
				
				fileItem.insertBefore(previewDiv, fileItem.firstChild);
			}
			
			reader.onload = function(e) {
				setTimeout(function() {
					var imgDiv = document.createElement('div');
					
					imgDiv.innerHTML = '<img src="'+ e.target.result +'">';
					
					previewDiv.appendChild(imgDiv);
				}, 121);
			}
			
			reader.readAsDataURL(file);
		},
		
		changeInput: function(elem) {
			var fileItems = elem.closest('.custom-file').querySelector('.custom-file__items');
			
			if (elem.getAttribute('data-action') == 'clear' || !elem.multiple) {
				this.clear(elem);
			}
			
			for (var i = 0; i < elem.files.length; i++) {
				var file = elem.files[i];
				
				if (this.filesObj[elem.id] && this.filesObj[elem.id][file.name] != undefined) continue;
				
				var fileItem = document.createElement('div');
				
				fileItem.className = 'custom-file__item';
				fileItem.innerHTML = '<div class="custom-file__name">'+ file.name +'</div><button type="button" class="custom-file__del-btn" data-ind="'+ file.name +'"></button>';
				
				fileItems.appendChild(fileItem);
				
				if (file.type.match(/image.*/)) {
					this.loadPreview(file, fileItem);
				}
			}
			
			this.setFilesObj(elem.files);
		},
		
		setFilesObj: function(filesList, objKey) {
			var inputElem = this.input;
			
			if (!inputElem.id.length) {
				inputElem.id = 'custom-file-input-'+ new Date().valueOf();
			}
			
			if (filesList) {
				this.filesObj[inputElem.id] = this.filesObj[inputElem.id] || {};
				
				for (var i = 0; i < filesList.length; i++) {
					this.filesObj[inputElem.id][filesList[i].name] = filesList[i];
				}
			} else {
				delete this.filesObj[inputElem.id][objKey];
			}
			
			this.filesArrayObj[inputElem.id] = [];
			
			for (var key in this.filesObj[inputElem.id]) {
				this.filesArrayObj[inputElem.id].push(this.filesObj[inputElem.id][key]);
			}
			
			ValidateForm.file(inputElem, this.filesArrayObj[inputElem.id]);
		},
		
		inputFiles: function(inputElem) {
			return this.filesArrayObj[inputElem.id] || [];
		},
		
		files: function(formElem) {
			var inputFileElements = formElem.querySelectorAll('.custom-file__input'),
			filesArr = [];
			
			if (inputFileElements.length == 1) {
				filesArr = this.filesArrayObj[inputFileElements[0].id];
			} else {
				for (var i = 0; i < inputFileElements.length; i++) {
					if (this.filesArrayObj[inputFileElements[i].id]) {
						filesArr.push({name: inputFileElements[i].name, files: this.filesArrayObj[inputFileElements[i].id]});
					}
				}
			}
			
			return filesArr;
		},
		
		init: function() {
			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="file"]');
				
				if (!elem) return;
				
				this.input = elem;
				
				this.changeInput(elem);
			});
			
			document.addEventListener('click', (e) => {
				var delBtnElem = e.target.closest('.custom-file__del-btn'),
				clearBtnElem = e.target.closest('.custom-file__clear-btn'),
				inputElem = e.target.closest('input[type="file"]');
				
				if (inputElem && inputElem.multiple) {
					inputElem.value = null;
				}
				
				if (delBtnElem) {
					this.input = delBtnElem.closest('.custom-file').querySelector('.custom-file__input');
					
					delBtnElem.closest('.custom-file__items').removeChild(delBtnElem.closest('.custom-file__item'));
					
					this.setFilesObj(false, delBtnElem.getAttribute('data-ind'));
				}
				
				if (clearBtnElem) {
					var inputElem = clearBtnElem.closest('.custom-file').querySelector('.custom-file__input');

					inputElem.value = null;
					
					this.clear(inputElem);
				}
			});
		}
	};
	
	//init script
	document.addEventListener('DOMContentLoaded', function() {
		CustomFile.init();
	});
})();