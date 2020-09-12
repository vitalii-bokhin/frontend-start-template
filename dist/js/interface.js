// submit form
try {
    Form.onSubmit(function (form, callback) {
        switch (form.id) {
            case 'form-no-ajax':
            case 'search-form':
                return true;

            case 'custom-form-2':
            case 'custom-form-3':
            case 'custom-form-4':
                var files = CustomFile.getFiles(form);

                console.log(files);

            default:
                ajax({
                    url: form.action,
                    send: new FormData(form),
                    success: function (response) {
                        var response = JSON.parse(response);

                        if (response.status == 'sent') {

                            Popup.message('Форма отправлена');
                            // ValidateForm.customErrorTip(input, errorTxt, isLockForm);
                            // ValidateForm.customFormErrorTip(formElem, errorTxt);
                            // Popup.message('Форма отправлена');
                            // Popup.message('Форма отправлена', '#message-popup', function() {});

                            callback({ clearForm: true, unlockSubmitButton: true });
                        } else {
                            console.log(response);
                        }
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
        }
    });
} catch (error) {
    console.log(error);
}
