define(function(require,exports){
	var $ = require("jquery");
	var layer = require('mod/common/layer');
	var FormValidator = require("mod/common/validate");

	var validatorForm = function (formName,fileds,callback) {
		
        new FormValidator(formName, fileds, function(errors, evt) {
            if (evt && evt.preventDefault) {
                evt.preventDefault();
            } else if (evt) {
                evt.returnValue = false;
            }
            
            if(errors.length>0){
                var  errorMsg = $(errors[0].element).data(errors[0].rule) || errors[0].message
                layer.open({
                    content:errorMsg ,
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    time: 1
                });
            }else{
                callback(formName);
            }            
        })
    }

    return validatorForm;
})