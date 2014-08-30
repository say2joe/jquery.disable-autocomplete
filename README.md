jquery.disable-autocomplete
===========================

This jQuery plug-in enforces the autocomplete=off HTML attribute on password (and other) fields. Recent browsers have chosen to ignore this attribute in favor of user preferences. However, some financial (and other) institutions may have good reasons to enforce this practice.

Add the (minified) file to your site, then just use:
```javascript
$('input[type=password]').disableAutocomplete();
```

The above creates two new fields (one is a clone with type text, the other is hidden and used to send the actual password data to the server) then removes the original pesky autocomplete field from the DOM.

* I will add implemnentation details soon. This is a rush upload, sorry.

Ref: http://plugins.jquery.com/disable-autocomplete/
