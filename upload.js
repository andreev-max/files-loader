function bytesToSize(bytes) {
	const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];
	if (!bytes) return '0 Byte';
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

function createElement(tag, classes = [], content) {
	const node = document.createElement(tag);

	if (classes.length) {
		node.classList.add(...classes);
	}

	if (content) {
		node.textContent = content;
	}

	return node;
}

function noop() {}

export function upload(selector, options = {}) {
	let files = [];
	const onUpload = options.onUpload || noop;
	const input = document.querySelector(selector);
	const preview = createElement('div', [ 'preview' ]);

	const open = createElement('button', [ 'btn' ], 'Open');

	const upload = createElement('button', [ 'btn', 'primary' ], 'Upload');
	upload.style.display = 'none';

	if (options.multi) {
		input.setAttribute('multiple', true);
	}

	if (options.accept && Array.isArray(options.accept)) {
		input.setAttribute('accept', options.accept.join(', '));
	}

	input.insertAdjacentElement('afterend', preview);
	input.insertAdjacentElement('afterend', upload);
	input.insertAdjacentElement('afterend', open);

	const triggerInput = () => input.click();

	const changeHandler = (event) => {
		if (!event.target.files.length) {
			return;
		}
		upload.style.display = 'inline';
		files = Array.from(event.target.files);

		preview.innerHTML = '';

		files.forEach((file) => {
			if (!file.type.match('image')) {
				return;
			}

			const reqder = new FileReader();

			reqder.onload = (event) => {
				// console.log(event.target);
				const src = event.target.result;

				const previewItem = document.createElement('div');
				const image = document.createElement('img');
				const previewRemove = document.createElement('div');
				const previewInfo = document.createElement('div');

				previewItem.classList.add('preview-image');
				previewRemove.classList.add('preview-remove');
				previewInfo.classList.add('preview-info');

				image.setAttribute('src', src);
				image.setAttribute('alt', file.name);
				previewRemove.innerHTML = '&times';
				previewRemove.setAttribute('data-name', file.name);
				previewInfo.innerHTML = `
        <p>${file.name}</p>
        <p>${bytesToSize(file.size)}</p>`;

				previewItem.appendChild(image);
				previewItem.appendChild(previewRemove);
				previewItem.appendChild(previewInfo);

				preview.insertAdjacentElement('afterbegin', previewItem);
			};

			reqder.readAsDataURL(file);
		});
	};

	const removeHandler = (event) => {
		// console.log(event.target.dataset);
		if (!event.target.dataset.name) {
			return;
		}

		const { name } = event.target.dataset;
		files = files.filter((file) => file.name !== name);

		if (!files.length) {
			setTimeout(() => {
				upload.style.display = 'none';
			}, 200);
		}

		const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image');
		block.classList.add('removing');
		setTimeout(() => {
			block.remove();
		}, 350);
		// console.log(block);
	};

	function clearPreview(elem) {
    elem.style.bottom = '0px'
		elem.innerHTML = `<div class='preview-info-progress'>
    </div>`;
	}

	function uploadHandler() {
		preview.querySelectorAll('.preview-remove').forEach((elem) => elem.remove());
		const previewInfo = preview.querySelectorAll('.preview-info');
		previewInfo.forEach(clearPreview);
		onUpload(files, previewInfo);
	}

	open.addEventListener('click', triggerInput);
	input.addEventListener('change', changeHandler);
	preview.addEventListener('click', removeHandler);
	upload.addEventListener('click', uploadHandler);
}
