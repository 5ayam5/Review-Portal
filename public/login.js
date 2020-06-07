const url = window.location.href;
const ret = url.split('return=')[1];

var type = document.getElementById('type');
var email = document.getElementById('email');
var password = document.getElementById('password');
var userName = document.getElementById('name');
var login = document.getElementById('login');

login.addEventListener('click', function () {
	if (email.value.endsWith('.iitd.ac.in') || email.value == 'sayam.sethi2@gmail.com') {
		firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == 'auth/user-not-found') {
				console.log('New User');
				if (type.selectedIndex == 0) {
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
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				if (!user.displayName) {
					let db = firebase.firestore();
					let cat = type.value;
					let user = firebase.auth().currentUser;
					db.collection(cat).doc(user.uid).set({
						uid: user.uid
					})
					user.updateProfile({
						displayName: userName.value
					}).then(function () {
						window.open(ret, '_self');
					}).catch(function (error) {
						var errorCode = error.code;
						var errorMessage = error.message;
						console.log(errorCode + ': ' + errorMessage);
					});
				} else {
					window.open(ret, '_self');
				}
			}
		});
	} else {
		alert('Please check the email (must contain your department too, example xxxx@yyyy.iitd.ac.in)');
	}
});