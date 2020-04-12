//pill arms
function manageRadios(sel) {
	//get pill position
	let pos = document.querySelector("input[name = '" + sel + "1']:checked").value;
	//set passive pill
	document.querySelectorAll("input[name = '" + sel + "2']").forEach(function (item) {
		item.checked = (item.value == pos) ? true : false;
	});
	//get degree value
	let deg = document.querySelector("input[name='" + sel + "_degree']:checked").value;
	if (pos == "center_center") {
		deg = "0";
	} else {
		if (deg == "0") { deg = "0.5"; }
	}
	//set degree value if needed
	document.querySelectorAll("input[name='" + sel + "_degree']").forEach(function (item) {
		item.checked = (item.value == deg) ? true : false;
	});
}
function calculatePills() {
	let toe = 3,
		antiSquat = 1,
		deg = 0,
		pos1 = "_out",
		pos2 = "down_",
		arm = ["c","d"],
		i = 0;
	//first pass C arm, second pass D arm
	while (arm[i]) {
		if (arm[i]=="d") {
			pos1 = "_in";
			pos2 = "up_";
		}
		let rbID = document.querySelector("input[name='" + arm[i] + "1']:checked").value;
		let val = parseFloat(document.querySelector("input[name='" + arm[i] + "_degree']:checked").value);
		deg = val;
		if (rbID.includes("_center")) {deg = 0;}
		if (rbID.includes(pos1)) {deg *= -1;}
		toe += deg;
		//calculate anti-squat
		deg = val;
		if (rbID.includes("center_")) {deg = 0;}
		if (rbID.includes(pos2)) {deg *= -1;}
		antiSquat += deg;
		i++;
	}
	document.querySelector(".result[id='toe']").innerHTML = toe;
	document.querySelector(".result[id='antisquat']").innerHTML = antiSquat;
}
function doPillFuncs(inArm) {
	manageRadios(inArm);
	calculatePills();
}

//oil mixing
function validate(n) {
	let result = true,
		i = 0;
	while (i<3) {
		if (n[i].length == 0 || n[i] <= 0 || isNaN(n[i])) {
			result = false;
			break;
		}
		i++;
	}
	return result;
}
function inRange(a, b, c) {
	let min = Math.min(a, b),
		max = Math.max(a, b);
	return c > min && c < max;
};
function calculateOil() {
	let viscA = document.getElementById("viscA").value,
		viscB = document.getElementById("viscB").value,
		target = document.getElementById("target").value;
	if (!validate([viscA, viscB, target])) {
		alert("All viscosity entries must be: \n     - A valid integer or float. \n     - Greater than zero.");
	} else {
		if (inRange(viscA, viscB, target)) {
			let partA = ( (Math.log(target) - Math.log(viscB)) / (Math.log(viscA) - Math.log(viscB)) ),
				partB = 1 - partA;
			document.getElementById("percentA").innerHTML = Math.round(partA*100);
			document.getElementById("percentB").innerHTML = Math.round(partB*100);
		} else {
			alert("Target viscosity must fall between the viscosities of fluid A and fluid B!");
		}
	}
}
function reset() {
	document.querySelector("input[id = 'viscA']").value = "";
	document.querySelector("input[id = 'viscB']").value = "";
	document.querySelector("input[id = 'target']").value = "";
	document.querySelector(".result[id = 'percentA']").innerHTML = "---";
	document.querySelector(".result[id = 'percentB']").innerHTML = "---";
}

//navigation
function activatePage(navId) {
	// change nav border
	let container = document.querySelectorAll(".navCtrl");
	container.forEach(function (item) {
		item.style.borderBottom = (item.id == 'nav' + navId) ? '2px solid darkblue' : 'none';
	});
	//switch pages
	container = document.querySelectorAll(".pageCtrl");
	container.forEach(function (item) {
		item.style.display = (item.id == 'page' + navId) ? 'block' : 'none';
	});
}