var login = document.getElementById('login');

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		login.innerHTML = 'logged in: ' + user.displayName;
	} else {
		login.innerHTML = 'login / register';
	}
});
login.addEventListener('click', function () {
	window.open('login.html?return=index.html', '_self');
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
	firebase.firestore().collection('courses').orderBy('name').get().then(function (querySnapshot) {
		var list = '';
		querySnapshot.forEach(function (doc) {
			let course = doc.data();
			if (course.name.toUpperCase().includes(searchCourses.value.toUpperCase())) {
				list += '<li onclick=\"navToCourse(\'' + doc.id + '\', \'' + course.code + '\')\">' + course.name + '</li>';
			}
		});
		coursesList.innerHTML = list;
	});
};

searchCourses.addEventListener('input', updateCourses);
updateCourses();

function navToCourse(id, code) {
	window.open('course.html?course=' + id + '&code=' + code);
}