var output = document.getElementById('output');
var formats = document.getElementsByClassName('formats');
var generateButton = document.getElementById('generate-button');
var quantity = document.getElementById('quantity');
var progressBar = document.getElementById('progress-bar');
var temp = document.getElementById('temp');

generateButton.addEventListener('click', function () {
  var formats = getEnabledFormats();
  if (!formats.length) {
    output.value = 'Please select at least one image format';
    return;
  }
  var _quantity = parseInt(quantity.value);
  if (isNaN(_quantity)) return;
  clear();
  disableElements();
  animateProgressBar();
  generate(_quantity, function (images) {
    enableElements();
    unanimateProgressBar();
    displayResult(images);
  });
});

/**
 * Helper functions
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEnabledFormats () {
  var _formats = [];
  each(formats, function (format) {
    if (format.checked) {
      _formats.push(format.value);
    }
  });
  return _formats;
}

function getRandomFormat () {
  var formats = getEnabledFormats();
  var index = getRandomInt(0, formats.length - 1);
  return formats[index];
}

function getRandomImgurId () {
  var base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var id = '';
  var length = getRandomInt(5, 6);
  while (id.length < length) {
    const pos = getRandomInt(0, base.length - 1);
    id += base.charAt(pos);
  }
  return id;
}

function getRandomImgurImage () {
  var base = 'https://i.imgur.com/';
  var id = getRandomImgurId();
  var format = getRandomFormat();
  var image = new Image();
  image.id = id;
  image.src = base + id + '.' + format;
  return image;
}

function isRemoved (image) {
  return (
    image.offsetWidth === 161
    && image.offsetHeight === 81
  );
}

function generate (quantity, callback) {
  var numTemp = 0;
  var numDone = 0;
  var images = [];
  output.value = 'Generating...';
  var generator = setInterval(function () {
    if (numTemp < quantity) {
      numTemp++;
      var image = getRandomImgurImage();
      temp.appendChild(image);
      image.onload = function () {
        if (isRemoved(this)) {
          numTemp--;
          this.remove();
        } else {
          numDone++;
          images.push(this);
          this.remove();
          progressBar.style.width = (images.length / quantity) * 100 + '%';
          if (numDone === quantity) {
            clearInterval(generator);
            callback(images);
          }
        }
      };
      image.onerror = function () {
        numTemp--;
        this.remove();
      };
    }
  }, 10);
}

function clear () {
  progressBar.style.width = '0';
  temp.innerHTML = '';
}

function animateProgressBar () {
  progressBar.classList.add('progress-bar-animated');
}

function unanimateProgressBar () {
  progressBar.classList.remove('progress-bar-animated');
}

function enableElements () {
  output.removeAttribute('disabled');
  generateButton.removeAttribute('disabled');
  quantity.removeAttribute('disabled');
  each(formats, function (format) {
    format.removeAttribute('disabled');
  });
}

function disableElements () {
  output.setAttribute('disabled', '');
  generateButton.setAttribute('disabled', '');
  quantity.setAttribute('disabled', '');
  each(formats, function (format) {
    format.setAttribute('disabled', '');
  });
}

function displayResult (images) {
  output.value = images.map(function (image) {
    return '\[img\]' + image.src + '\[\/img\]';
  }).join('\n');
  output.selectionStart = 0;
  output.selectionEnd = output.value.length;
  output.focus();
}

function each (elements, fn) {
  for (var i = 0; i < elements.length; i++) {
    fn(elements.item(i));
  }
}
