/*
* jQuery Disable Autocomplete Plugin v${version}
* https://github.com/say2joe/jquery.disable-autocomplete
*
* Date: ${timestamp}
*/
(function($) {

	function disableAutocomplete() {

		var $input = $(this).attr("autocomplete", "off").val('');

		if (typeof this.selectionStart === "undefined") {
			return true; // Older browsers are OK.
		}

		var $clone = $input.clone().removeAttr("placeholder");
		var $hidden = $input.clone().removeAttr("placeholder").attr("type", "hidden");

		var rePswdChar = /^[\w\ \`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\/\?\.\>\,\<\'\"\;\:\\\|\]\}\[\{]$/;
		var reBackDelete = /^(8|46)$/;
		var reArrowKey = /^(37|39)$/;
		var reSubmit = /^(13)$/;

		function maskAndSyncInputs (event) {
			var key = event.which;
			var maskedValue = $clone.val();
			var actualValue = $hidden.val();
			var cursorPos = this.selectionStart;
			var character = String.fromCharCode(key);
			var selectionLength = (this.selectionEnd - cursorPos);

			var isSubmit = reSubmit.test(key);
			var isArrowKey = reArrowKey.test(event.keyCode);
			var isBackspaceOrDelete = reBackDelete.test(key);
			var isAcceptablePswdChar = rePswdChar.test(character);

			if (maskedValue === "password") maskedValue = '';
			if (actualValue === "password") actualValue = '';

			var arrMaskedValue = maskedValue.split('');
			var arrActualValue = actualValue.split('');

			if (event.type === "keydown") {
				if (isBackspaceOrDelete) {
					if (selectionLength) {
						//arrMaskedValue.splice(cursorPos, selectionLength);
						arrActualValue.splice(cursorPos, selectionLength);
					} else if (key === 46) { // Delete next character
						//arrMaskedValue.splice(cursorPos, 1);
						arrActualValue.splice(cursorPos, 1);
					} else { // Delete last character (backspace)
						//arrMaskedValue.splice(--cursorPos, 1);
						arrActualValue.splice(cursorPos, 1);
					}
					$hidden.val(arrActualValue.join(''));
					//$clone.val(arrMaskedValue.join(''));
				}
				return true;
			} else if (event.type === "keypress") {
				if (isSubmit) this.form.submit();
				if (isAcceptablePswdChar) {
					arrActualValue.splice(cursorPos, selectionLength, character);
					arrMaskedValue.splice(cursorPos, selectionLength, '*');
					cursorPos++;
				} else {
					return isBackspaceOrDelete || isArrowKey;
				}
			} else {
				// Disable pasting passwords.
				return false;
			}

			maskedValue = arrMaskedValue.join('');
			actualValue = arrActualValue.join('');

			$hidden.val(actualValue);
			$clone.val(maskedValue);

			this.setSelectionRange(
				cursorPos, cursorPos
			);

			return false;
		}

		$clone.attr({
			type : "text", name : ""
		}).on(
			"keypress keydown paste", maskAndSyncInputs
		);

		$input.before(
			$hidden, $clone
		).remove();

		$input = null;
	}

	$.fn.extend({
		disableAutocomplete: function() {
			var reValidFields = /text|password/i;
			return this.each(function() {
				if (reValidFields.test(this.type)) {
					disableAutocomplete.call(this);
				}
			});
		}
	});

})(jQuery);
