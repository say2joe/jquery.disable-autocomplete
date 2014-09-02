/*
* jQuery Disable Autocomplete Plugin v${version}
* https://github.com/say2joe/jquery.disable-autocomplete
*
* Date: ${timestamp}
*/
(function($) {

	function disableAutocomplete() {

		var $input = $(this).attr("autocomplete", "off");
		if (typeof this.selectionStart === "undefined") {
			return true; // Older browsers are OK.
		}

		var $hidden = $input.clone().attr("type", "hidden");
		var $clone = $input.clone();

		var rePswdChar = /^[\ \w\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\/\?\.\>\,\<\'\"\;\:\\\|\]\}\[\{]$/;
		var reArryowKey = /^(37|39)$/;
		var reBackDelete = /^(8|46)$/;

		function maskAndSyncInputs (event) {
			var key = event.which;
			var maskedValue = $clone.val();
			var actualValue = $hidden.val();
			var cursorPos = this.selectionStart;
			var character = String.fromCharCode(key);
			var selectionLength = (this.selectionEnd - cursorPos);

			var isArrowKey = reArryowKey.test(event.keyCode);
			var isBackspaceOrDelete = reBackDelete.test(key);
			var isAcceptablePswdChar = rePswdChar.test(character);

			var arrMaskedValue = maskedValue.split('');
			var arrActualValue = actualValue.split('');

			if (event.type === "keydown") {
				if (isBackspaceOrDelete) {
					if (selectionLength) {
						arrActualValue.splice(cursorPos, selectionLength);
					} else if (key === 46) { // Delete next character
						arrActualValue.splice(cursorPos, 1);
					} else { // Delete last character (backspace)
						arrActualValue.splice(--cursorPos, 1);
					}
					$hidden.val(arrActualValue.join(''));
				}
				return true;
			} else if (event.type === "keypress") {
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
