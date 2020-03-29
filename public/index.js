var login = document.getElementById('login');

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		login.innerHTML = 'logged in: ' + user.displayName;
	} else {
		login.innerHTML = 'login';
	}
});
login.addEventListener('click', function () {
	window.open('login.html', '_self');
});

var logout = document.getElementById('logout');
logout.addEventListener('click', function () {
	firebase.auth().signOut().then(function () {

	}).catch(function () {

	});
});

var courses = document.getElementById('courses');
var searchCourses = document.getElementById('searchCourses');
var coursesList = document.getElementById('coursesList');
var updateCourses = function () {
	let query = firebase.firestore().collection('courses').orderBy('name');
	query.onSnapshot(function (snapshot) {
		var list = '';
		snapshot.docChanges().forEach(function (change) {
			if (change.type != 'removed') {
				var course = change.doc.data();
				if (course.name.toUpperCase().includes(searchCourses.value.toUpperCase())) {
					list += '<li onclick=\"navToCourse(\'' + course.code + '\')\">' + course.name + '</li>';
				}
			}
		});
		coursesList.innerHTML = list;
	});
};

searchCourses.addEventListener('input', updateCourses);
updateCourses();

function navToCourse(code) {
	window.open('course.html?course=' + code);
}