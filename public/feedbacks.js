const url = new URL(window.location.href);
const courseID = url.searchParams.get('course');
const profID = url.searchParams.get('prof');
const db = firebase.firestore().collection('courses').doc(courseID).collection('profs').doc(profID).collection('feedbacks');

var login = document.getElementById('login');

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		login.innerHTML = 'logged in: ' + user.displayName;
	} else {
		login.innerHTML = 'login / register';
	}
});
login.addEventListener('click', function () {
	window.open('login.html?return=feedbacks.html?course=' + courseID + '&prof=' + profID, '_self');
});

var logout = document.getElementById('logout');
logout.addEventListener('click', function () {
	firebase.auth().signOut().then(function () {

	}).catch(function () {

	});
});

var feedbacks = document.getElementById('feedbacks');
var feedbackList = document.getElementById('feedbackList');
window.addEventListener('load', function () {
	db.get().then(function (querySnapshot) {
		var list = '';
		querySnapshot.forEach(function (doc) {
			let feedback = doc.data().course;
			console.log(feedback.length)
			if (feedback.length >= 50) {
				feedback = feedback.substring(0, 50) + '&hellip;';
			}
			list += '<li onclick=\"expandFeedback(this, \'' + doc.id + '\')\">' + feedback + '</li>';
		})
		feedbackList.innerHTML = list;
	})
});

function expandFeedback(who, docID) {
	if (who.children.length) {
		for (let i = 0; i < who.children.length; i++) {
			if (who.children[i].style.display == 'none') {
				who.children[i].style.display = 'block';
			} else {
				who.children[i].style.display = 'none';
			}
		}
		report(who.children[1], docID, false);
	} else {
		let ul = document.createElement('ul');
		who.appendChild(ul);
		let li1 = document.createElement('li');
		let li2 = document.createElement('li');
		ul.appendChild(li1);
		ul.appendChild(li2);
		li1.setAttribute('class', 'lili');
		li2.setAttribute('class', 'lili');
		db.doc(docID).get().then(function (doc) {
			let feedback = doc.data();
			li1.innerHTML = 'Course:<br />' + feedback.course;
			li2.innerHTML = 'Professor:<br />' + feedback.prof;
		});
		firebase.firestore().collection('prof').doc(firebase.auth().currentUser.uid).get().then(function (doc) {
			if (doc.exists) {
				let a = document.createElement('a');
				who.appendChild(a);
				report(a, docID, false);
				a.setAttribute('onclick', 'report(this, \'' + docID + '\', true)');
			}
		});
	}
}

function report(which, docID, set) {
	db.doc(docID).get().then(function (doc) {
		let status = doc.data().flag;
		if (set && !status) {
			db.doc(docID).set({
				flag: true
			}, {
				merge: true
			});
			status = true;
		}
		if (status) {
			which.innerHTML = 'Reported';
			which.style.background = '#f44336';
		} else {
			which.innerHTML = 'Report';
			which.style.background = '#039be5';
		}
	})
}