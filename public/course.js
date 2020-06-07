const url = new URL(window.location.href);
const courseID = url.searchParams.get('course');
const courseCode = url.searchParams.get('code');
document.title = courseCode;
document.getElementById('h1').innerHTML += courseCode;

var login = document.getElementById('login');

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		login.innerHTML = 'logged in: ' + user.displayName;
	} else {
		login.innerHTML = 'login / register';
	}
});
login.addEventListener('click', function () {
	window.open('login.html?return=course.html?course=' + courseID, '_self');
});

var logout = document.getElementById('logout');
logout.addEventListener('click', function () {
	firebase.auth().signOut().then(function () {

	}).catch(function () {

	});
});

var profs = document.getElementById('profs');
var profList = document.getElementById('profList');

window.addEventListener('load', function () {
	firebase.firestore().collection('courses').doc(courseID).collection('profs').get().then(function (querySnapshot) {
		var list = '';
		querySnapshot.forEach(function (doc) {
			let prof = doc.data();
			list += '<li onclick=\"navToProf(\'' + courseID + '\', \'' + prof.uid + '\')\">' + prof.name + '</li>';
		});
		profList.innerHTML = list;
	});
});

function navToProf(course, prof) {
	window.open('feedbacks.html?course=' + course + '&prof=' + prof);
}