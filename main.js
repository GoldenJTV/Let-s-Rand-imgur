var body = document.getElementsByTagName('body')[0];
var output = document.getElementById('output');
var result = document.getElementById('result');
var progress = document.getElementById('progress');
var temp = document.getElementById('temp');
var images = [];
var generator;

result.innerText = '(Ready)';

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomImgurId () {
  var base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var id = '';
  const length = getRandomInt(5, 6);
  for (i = 0; i < length; i++) {
    const pos = getRandomInt(0, base.length - 1);
    id += base.charAt(pos);
  }
  return id;
}

function getRandomImgurImage () {
  var imageRoot = 'https://i.imgur.com/';
  var exts = ['.jpg', '.png', '.gif'];
  var id = getRandomImgurId();
  var ext = exts[getRandomInt(0, exts.length - 1)];
  var image = new Image();
  image.id = id;
  image.src = imageRoot + id + ext;
  return image;
}

function isRemoved (image) {
  return (
    image.offsetWidth == 161
    && image.offsetHeight == 81
  );
}

function generate (quantity, callback) {
  var numTemp = 0;
  var numDone = 0;
  generator = setInterval(function () {
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
          progress.style.width = (images.length / quantity) * 100 + '%';
          result.innerText = '(' + images.length + ' done.)';
          if (numDone === quantity) {
            clearInterval(generator);
            callback();
          }
        }
      };
      image.onerror = function () {
        numTemp--;
        this.remove();
      };
    }
  }, 100);
}

function clear () {
  images = [];
  progress.style.width = '0';
  temp.innerHTML = '';
}

function start () {
  clear();
  body.className = 'generating';
  output.value = 'Generating...';
  result.innerText = '(0 done.)';
  var quantity = document.getElementById('quantity').value;
  quantity = parseInt(quantity);
  generate(quantity, function () {
    body.className = '';
    output.value = '';
    for (i = 0; i < images.length; i++) {
      output.value += '\[img\]' + images[i].src + '\[\/img\]\n';
    }
    output.selectionStart = 0;
    output.selectionEnd = output.value.length - 1;
    output.focus();
    result.innerText = '(All done!)';
  });
}
