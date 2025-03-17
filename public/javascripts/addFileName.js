function previewMultiple(event) {
    const form = document.querySelector('#formFile');
    form.innerHTML = "";
    var images = document.getElementById("image");
    var number = images.files.length;
    for (i = 0; i < number; i++) {
        var file = event.target.files[i];
        var urls = URL.createObjectURL(file);
        var filename = file.name;
        document.getElementById("formFile").innerHTML += '<div><img src="' + urls + '"><p>' + filename + '</p></div>';
    }
}