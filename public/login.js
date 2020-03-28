var type = document.getElementById('type');
var email = document.getElementById('email');
var password = document.getElementById('password');
var userName = document.getElementById('name');
var login = document.getElementById('login');

login.addEventListener('click', function () {
	firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/user-not-found') {
			console.log('New User');
			if (type.selectedIndex == 0 || type.selectedIndex == 3) {
				alert('New user, please select Professor or Student');
			} else {			
				if (userName.value) {
					firebase.auth().createUserWithEmailAndPassword(email.value, password.value).catch(function (error) {
						var errorCode = error.code;
						var errorMessage = error.message;
						console.log(errorCode + ": " + errorMessage);
					});
				} else {
					alert('New user, please enter a name');
				}
			}
		} else {
			console.log(errorCode + ": " + errorMessage);
			alert('Please check the email or password and try again!');
		}
	});
});

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		if (!user.displayName) {
			let db = firebase.firestore();
			let cat = type.value;
			let user = firebase.auth().currentUser;
			db.collection(cat).add({
				uid: user.uid
			}).then(function () {
				user.updateProfile({
					displayName: userName.value
				});
			}).then(function () {
				window.open('index.html', '_self');
			}).catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(errorCode + ': ' + errorMessage);
			});
		} else {
			window.open('index.html', '_self');
		}
	}
});