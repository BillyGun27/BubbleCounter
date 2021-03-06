var Service = function(config = {}){
	var uri = (config.uri == null) ? null : config.uri;
	var type = (config.type == null) ? 'get' : config.type;
	var data = (config.data == null) ? {} : config.data;
	var async = (config.async == null) ? true : Boolean(config.async);
	var timeout = (config.timeout == null) ? 3000 : config.timeout;
	var token = config.token;
	var loading = (config.loadng == null) ? true : config.loading;

	var response = null;
	var is_successful = false;

	this.start = function(conf = {}, callback = function(){}){
		uri = (conf.uri == null) ? uri : conf.uri;
		type = (conf.type == null) ? type : conf.type;
		data = (conf.data == null) ? data : conf.data;
		async = (conf.async == null) ? async : Boolean(conf.async);
		timeout = (conf.timeout == null) ? timeout : conf.timeout;
		token = (conf.token == null) ? token : conf.token;
		loading = (conf.loading == null) ? loading : conf.loading;
		
		$.ajax({
	      type: type,
	      url: uri,
	      data: data,
	      dataType: "json",
	      headers: {
        	'Authorization': token,
    	  },
	      async: async,
	      timeout: timeout,

	      beforeSend: Redirect.startLoading(loading),
          complete: function(){
          	callback();
          	Redirect.stopLoading(loading);
          },

	      success: function (body, textStatus, data) {
	        console.info(uri + "\ncode: " + data.status + ", status: " + data.statusText);

	        if((response = data.responseJSON) != null){
	          is_successful = true;
	          
	          //console.log("data: " + JSON.stringify(response.data));
	        }
	          
	      },

	      error: function (data) {
	        console.warn(uri + "\ncode: " + data.status + ", status: " + data.statusText);
	              
	        if((response = data.responseJSON) != null){
	          is_successful = false;
	          
	          console.warn("message: " + response.message);
	        }
	         
	      }
	    });


	}

	this.isSuccessful = function(){
		return is_successful;
	}

	this.response = function(){
		return response;
	}

	
};