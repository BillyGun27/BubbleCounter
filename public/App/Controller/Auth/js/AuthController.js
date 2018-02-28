App.include(null, function(){
  new AuthController;
});


var AuthController = function(){
  var session = new Session;
  var service = new Service;
  
  if(session.get("token")  != null ){
    Redirect.start('../home');
	}

  var loginSubmit = function(email, password){
    var data = {
      email: email,
      password: password
    }

    service.start({
      type: 'post',
      uri: 'http://ifish.machinevision.global/auth/login',// App.baseAPI() + '/auth/login',
      data: data
    }, function(){
      alert(service.response().token);
      console.log(service.response());
      if(service.isSuccessful()){
        if(service.response().token != "email false" && service.response().token != "password false" ){
          session.set('token', service.response().token);
          //session.set('is_active', service.response().data.is_active);
          //session.set('status', service.response().data.status);
  
          //if(service.response())
            Redirect.start('../home');
        }else{
          $.toaster({ priority : 'error', title : 'Message', message : 'Invalid email or password!'});
          session.destroy();
        }
      
      }
      else{
        session.destroy();
        $.toaster({ priority : 'error', title : 'Message', message : 'Invalid email or password!'});
      }

    });

    //if(data.email == 'ifish' && data.password == 'ifishindonesia2018'){
      //Redirect.start('../home#home');
    //}
    //else{
      // $.toaster({ priority : 'error', title : 'Message', message : 'Invalid email or password!'});
    //}
  }

  this.login = function(){
    var request = new Request;
    var email = request.input($('input[name=email]').val()).makeValid('required').save();
    var password = request.input($('input[name=password]').val()).makeValid('required').save();

    if(request.isValid()){
      loginSubmit(email, password);
    }
    else{
      $.toaster({ priority : 'error', title : 'Message', message : 'Please, fill the forms correctly!'});
    }
  }

  this.logout = function(){
    /*var service = new Service;

    service.start({
        uri: App.baseAPI() + '/api/auth/logout',
        token: session.get('token')
    }, function(){

      if(service.isSuccessful()){
        //session.destroy();
      }

      Redirect.start('login');
    });*/
    //Redirect.start('../account/login');
  }

}
