//Mixpanel
(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("0d2f16c090a094f434fd3a30d5df6bb6");

var oFirebaseRef = new Firebase("https://boiling-torch-2236.firebaseio.com/web/");

oFirebaseRef.onAuth(authDataCallback);


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
	if(authData){
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
        mixpanel.identify(authData.uid);
		window.location = "list.html";
	} else{
		console.log("User is logged out");
	}
}

//function that handles the login callback from firebase
function authHandler(error, authData){
	if(error){
		console.log("Login Failed!", error);
		Rollbar.error("Login failed", {authData: authData, error: error});
	} else{
		console.log("Authenticated successfully with payload:", authData);
		firebasePersistUserAuth(authData);
	}
}

function firebaseLogin(userEmail, password){
	oFirebaseRef.authWithPassword({
		email		: userEmail,
		password	: password
		}, authHandler
	);
    mixpanel.people.set({"$email": userEmail});
}

function firebasePersistUserAuth(authData){
	oFirebaseRef.child("users").child(authData.uid).set({
		provider: authData.provider,
		name: authData.password.email.replace(/@.*/, '')
	});
	window.location = "list.html";
}

function firebaseCreateUser(userEmail, password){
	oFirebaseRef.createUser({
		email: userEmail,
		password: password
	}, function(error, userData){
		if (error){
			console.log("Error creating user:", error);
			Rollbar.error("An error occured while creating a user", {userData: userData, error: error});
		} else{
			console.log("Successfully created user account with uid:", userData.uid);
			Rollbar.info("A new user has been created", {userData: userData})
			//Notify that your username has been created
			document.querySelector('#signInMessage').style.display;

			//clear text fields
			document.querySelector('#usermail').value = "";
			document.querySelector('#password').value = "";
		}
	});
}

document.querySelector('#loginButton').onclick=function(){
	var userEmail = document.querySelector('#usermail').value;
	var password = document.querySelector('#password').value; 
	firebaseLogin(userEmail, password);
	
};

document.querySelector('#signUpButton').onclick=function(){
	var userEmail = document.querySelector('#usermail').value;
	var password = document.querySelector('#password').value;
	firebaseCreateUser(userEmail, password);
	
}

// document.querySelector('#signUpButton').onclick=function(){
// 	var signUpText = document.getElementById("signInMessage");
//   	signUpText.style.display = "block";
// };
