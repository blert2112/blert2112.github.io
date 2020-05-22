//common
const rcModels = [
	{
		modelName : "ae b6",
		internalGear : 2.60,
		initToe : 3,
		initAntiSquat : 1,
		halfDegToMM : 0.35,
		oneDegToMM : 0.7
	},
	{
		modelName : "tlr 22",
		internalGear : 2.43,
		initToe : -1,
		initAntiSquat : -1,
		halfDegToMM : -1,
		oneDegToMM : -1
	},
	{
		modelName : "xray xb2",
		internalGear : 2.65,
		initToe : 3,
		initAntiSquat : 2,
		halfDegToMM : 0.375,
		oneDegToMM : 0.75
	}
]

//on load
function bodyOnLoad() {
//fill model selectors
	let gears = document.querySelector("select[id = 'modelsGears']");
	let pills = document.querySelector("select[id = 'modelsPills']");
	rcModels.forEach(function (item, index) {
		//fill gears select input
		let opt = document.createElement('option');
		opt.textContent = item.modelName;
		opt.value = index;
		gears.appendChild(opt);
		//fill pills select input
		if (item.initToe != -1) {
			opt = document.createElement('option');
			opt.textContent = item.modelName;
			opt.value = index;
			pills.appendChild(opt);
		}
	});
	resetResult("toe", rcModels[0].initToe);
	resetResult("antisquat", rcModels[0].initAntiSquat);
}

//navigation
function activatePage(id) {
	// change nav border
	let container = document.querySelectorAll('.navCtrl');
	container.forEach(function (item) {
		item.style.color = (item.id == 'nav' + id) ? 'var(--paper)' : 'black';
	});
	//switch pages
	container = document.querySelectorAll('.pageCtrl');
	container.forEach(function (item) {
		item.style.display = (item.id == 'page' + id) ? 'block' : 'none';
	});
}

//support
function resetInput(id) {
	document.querySelector("input[id = '" + id + "']").value = "";
}
function resetResult(id, val) {
	document.querySelector(".result[id = '" + id + "']").innerHTML = val;
}
function round(val, deci) {
	return Number(Math.round(val + 'e' + deci) + 'e-' + deci);
}
function validateNumber(nArr) {
	let result = true;
	for (let item of nArr) {
		if (item.length == 0 || item <= 0 || isNaN(item)) {
			result = false;
			break;
		}
	}
	return result;
}
function inRange(a, b, c) {
	let min = Math.min(a, b),
		max = Math.max(a, b);
	return c > min && c < max;
};

//pill arms
function setModelValues(that) {
	resetResult("toe", rcModels[that.value].initToe);
	resetResult("antisquat", rcModels[that.value].initAntiSquat);
	resetResult("roll", 0);
	resetResult("pivot", 0);
	let rad = document.querySelector("input[name='c'][value='center_center']");
	rad.checked = true;
	rad.onchange(); //lower case only, 'onChange' will error
	rad = document.querySelector("input[name='d'][value='center_center']");
	rad.checked = true;
	rad.onchange(); //lower case only, 'onChange' will error
}
function manageRadios(that) {
	let iName = "input[name='" + that.name;
	if (that.name.length == 1) {
		//disable current passive
		document.querySelector(iName + "_passive']:checked").disabled = true;
		//set new passive arm
		let rad = document.querySelector(iName + "_passive'][value='" + that.value + "']");
		rad.checked = true;
		rad.disabled = false;
		let degRads = document.querySelectorAll(iName + "_degree']");
		let degPass = document.querySelectorAll(iName + "_degree_passive']");
		if (that.value == "center_center") {
			degRads[0].checked = true;
			degRads[0].disabled = false;
			degRads[1].disabled = true;
			degRads[2].disabled = true;
			degRads[3].disabled = true;
			degRads[4].disabled = true;
			degPass[0].checked = false;
			degPass[0].disabled = true;
			degPass[1].checked = false;
			degPass[1].disabled = true;
		} else {
			if (degRads[0].checked == true) degRads[1].checked = true;
			degRads[0].disabled = true;
			degRads[1].disabled = false;
			degRads[2].disabled = false;
			if (that.value.includes("center")) {
				if (degRads[3].checked == true || degRads[4].checked == true) degRads[1].checked = true;
				degRads[3].disabled = true;
				degRads[4].disabled = true;
				degPass[0].checked = false;
				degPass[0].disabled = true;
				degPass[1].checked = false;
				degPass[1].disabled = true;
			} else {
				degRads[3].disabled = false;
				degRads[4].disabled = false;
			}
		}
	} else {
		let degRads = document.querySelectorAll(iName + "']");
		let degPass = document.querySelectorAll(iName + "_passive']");
		if (degRads[3].checked == true) {
			degPass[0].checked = true;
			degPass[0].disabled = false;
			degPass[1].disabled = true;
		} else if (degRads[4].checked == true) {
			degPass[1].checked = true;
			degPass[1].disabled = false;
			degPass[0].disabled = true;
		} else {
			degPass[0].checked = false;
			degPass[0].disabled = true;
			degPass[1].checked = false;
			degPass[1].disabled = true;
		}
	}
	calculatePills();
}
function calculatePills() {
	function calcDegree(quant, id, center, pos) {
		if (id.includes(center)) {
			quant = 0;
		} else {
			let t = quant.charAt(quant.length - 1);
			switch (true) {
				case (t == "L") && (id == "up_out" || id == "down_in"):
					if (center == "_center") quant = 0.5; else quant = 1;
					break;
				case (t == "L") && (id == "down_out" || id == "up_in"):
					if (center == "_center") quant = 1; else quant = 0.5;
					break;
				case (t == "R") && (id == "up_out" || id == "down_in"):
					if (center == "_center") quant = 1; else quant = 0.5;
					break;
				case (t == "R") && (id == "down_out" || id == "up_in"):
					if (center == "_center") quant = 0.5; else quant = 1;
			}
		}
		quant = parseFloat(quant);
		if (id.includes(pos)) quant *= -1;
		return quant;
	}
	function calcRollPivot(quant, id, center, pos, index) {
		quant = Math.abs(calcDegree(quant, id, center, pos));
		if (quant == 0.5) quant = rcModels[index].halfDegToMM;
		else if (quant == 1.0) quant = rcModels[index].oneDegToMM;
		if (id.includes(pos)) quant *= -1;
		return quant;
	}
	let selIndex = document.querySelector("select[id = 'modelsPills']").value,
		toe = rcModels[selIndex].initToe,
		antiSquat = rcModels[selIndex].initAntiSquat,
		roll = 0,
		pivot = 0,
		arm = ["c","d"],
		pos1 = "_out",
		pos2 = "down_";
	arm.forEach (function(item, index) {
		if (index == 1) {
			pos1 = "_in";
			pos2 = "up_";
		}
		let rbID = document.querySelector("input[name='" + item + "']:checked").value;
		let rbVal = document.querySelector("input[name='" + item + "_degree']:checked").value;
		toe += calcDegree(rbVal, rbID, "_center", pos1);
		antiSquat += calcDegree(rbVal, rbID, "center_", pos2);
		pivot += calcRollPivot(rbVal, rbID, "_center", "_in", selIndex);
		roll += calcRollPivot(rbVal, rbID, "center_", "down_", selIndex);
	})
	resetResult("toe", toe);
	resetResult("antisquat", antiSquat);
	resetResult("roll", round(roll/2, 3));
	resetResult("pivot", round(pivot/2, 3));
}

//oil mixing
function calculateOil(btnObj) {
	btnObj.blur();
	let viscA = document.querySelector("input[id = 'viscA']").value;
		viscB = document.querySelector("input[id = 'viscB']").value;
		target = document.querySelector("input[id = 'target']").value;
	if (validateNumber([viscA, viscB, target])) {
		if (inRange(viscA, viscB, target)) {
			let partA = ( (Math.log(target) - Math.log(viscB)) / (Math.log(viscA) - Math.log(viscB)) ),
				partB = 1 - partA;
			document.querySelector(".result[id = 'percentA']").innerHTML = round(partA*100, 0);
			document.querySelector(".result[id = 'percentB']").innerHTML = round(partB*100, 0);
		} else {
			resetResult('percentA');
			resetResult('percentB');
			alert("Target viscosity must fall between the viscosities of fluid A and fluid B!");
		}
	} else {
		resetResult('percentA');
		resetResult('percentB');
		alert("All viscosity entries must be: \n     - A valid integer or float. \n     - Greater than zero.");
	}
}
function resetOil(btnObj) {
	btnObj.blur();
	resetInput('viscA');
	resetInput('viscB');
	resetInput('target');
	resetResult('percentA');
	resetResult('percentB');
}

//gear ratio: spur / pinion * trans
function calculateGear(btnObj) {
	btnObj.blur();
	let spur = document.querySelector("input[id = 'spur']").value,
		pinion = document.querySelector("input[id = 'pinion']").value,
		transmission = document.querySelector("select[id = 'modelsGears']"),
		tire = document.querySelector("input[id = 'tire']").value;
	if (transmission.selectedIndex > 0) {
		if (validateNumber([spur, pinion, tire])) {
			let finalGear = (spur / pinion) * transmission.value;
			document.querySelector(".result[id = 'final']").innerHTML = round(finalGear, 3);
			document.querySelector(".result[id = 'rollout']").innerHTML = round((tire * 3.1415) / finalGear, 3);
		} else {
			resetResult('final');
			resetResult('rollout');
			alert("All gear entries must be: \n     - A valid integer or float. \n     - Greater than zero.");
		}
	} else {
		resetResult('final');
		resetResult('rollout');
		alert("Please select a model for the internal transmission gear ratio.");
	}
}
function resetGear(btnObj) {
	btnObj.blur();
	resetInput('spur');
	resetInput('pinion');
	resetInput('tire');
	resetResult('final');
	resetResult('rollout');
}

