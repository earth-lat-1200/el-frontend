import axios from 'axios';

export function setImage2Element(url, element) {
  console.log('load image');
  //calls the get method of a specific url and excepts a blob (here a image) as a response
  axios.get(url, { responseType:"blob" })
    .then(function (response) {
        var reader = new window.FileReader();
        reader.readAsDataURL(response.data);
        reader.onload = function() {
            //turns the receive answer to an img and sets it to the specific element in the DOM
            var imageDataUrl = reader.result;
            element.setAttribute("src", imageDataUrl);
            //here the loader gets switched off and the Live-Part gets displayed
            document.getElementById('loaded').classList.remove('notVisible');
            document.getElementById('loaded').classList.add('visible');
            document.getElementById('loader').classList.remove('visible');
            document.getElementById('loader').classList.add('notVisible');
        }
    });
}
