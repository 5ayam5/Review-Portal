var login = document.getElementById('login');
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		login.innerHTML = 'logged in: ' + user.displayName;
	} else {
		login.innerHTML = 'login';
	}
});
login.addEventListener('click', function () {
	if (login.innerHTML == 'login') {
		window.open('login.html', '_self');
	}
});

var logout = document.getElementById('logout');
logout.addEventListener('click', function () {
	firebase.auth().signOut().then(function () {

	}).catch(function () {

	});
});