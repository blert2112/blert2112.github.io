//global constants
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

//support
function getCheckedByName(name) {
	return document.querySelector("[name='" + name + "']:checked");
}
function getElementByID(id) {
	return document.querySelector("#" + id);
}
function getRadioByNameAndValue(name,val) {
	return document.querySelector("[name='" + name + "'][value='" + val + "']");
}
function getAllByClass(cla) {
	return document.querySelectorAll("." + cla);
}
function getRadiosByName(name) {
	return document.querySelectorAll("[type='radio'][name='" + name + "']");
}
function getRadiosByValue(val) {
	return document.querySelectorAll("[type='radio'][value='" + val + "']");
}
function setTextByID(id,txt) {
	document.querySelector("#" + id).innerHTML = txt;
}
function round(val,deci) {
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
function targetInRange(targ,r1,r2) {
	let min = Math.min(r1,r2),
		max = Math.max(r1,r2);
	return targ > min && targ < max;
}
function restrictNonNumeric() {
	const codes = [69,107,109,187,189]; // exclude ... e,num+,num-,+,-
	if (codes.includes(event.keyCode)) return false;
	else return true;
}

//common
function bodyOnLoad() {
	rcModels.forEach(function (item, index) {
		let opt = document.createElement('option');
		opt.textContent = item.modelName;
		opt.value = item.internalGear;
		getElementByID("modelsGears").appendChild(opt);
		if (item.initToe != -1) {
			opt = document.createElement('option');
			opt.textContent = item.modelName;
			opt.value = index;
			getElementByID("modelsPills").appendChild(opt);
		}
	});
	setTextByID("toe", rcModels[0].initToe);
	setTextByID("antisquat", rcModels[0].initAntiSquat);
	setTextByID("internal", rcModels[0].internalGear);
}
function setModelValues(that) {
	switch (that.id) {
		case ("modelsPills"):
			setTextByID("toe", rcModels[that.value].initToe);
			setTextByID("antisquat", rcModels[that.value].initAntiSquat);
			setTextByID("roll", 0);
			setTextByID("pivot", 0);
			let radios = getRadiosByValue("center_center");
			radios.forEach (function(item, index) {
				if (!item.name.includes("passive")) {
					item.checked = true;
					item.onchange(); //lower case only, 'onChange' will error
				}
			})
			break;
		case ("modelsGears"):
			setTextByID("internal", that.value);
			calculateGear();
	}
}

//navigation
function activatePage(id) {
	// change nav color
	let container = getAllByClass('navCtrl');
	container.forEach(function(item) {
		item.style.color = (item.id == 'nav' + id) ? 'var(--paper)' : 'black';
	});
	//switch pages
	container = getAllByClass('pageCtrl');
	container.forEach(function(item) {
		item.style.display = (item.id == 'page' + id) ? 'block' : 'none';
	});
}

//pill arms
function manageRadios(that) {
	let iName = "input[name='" + that.name;
	if (that.name.length == 1) {
		//disable current passive
		getCheckedByName(that.name + "_passive").disabled = true;
		//set new passive arm
		let rad = getRadioByNameAndValue(that.name + "_passive", that.value);
		rad.checked = true;
		rad.disabled = false;
		let degRads = getRadiosByName(that.name + "_degree");
		let degPass = getRadiosByName(that.name + "_degree_passive");
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
		let degRads = getRadiosByName(that.name);
		let degPass = getRadiosByName(that.name + "_passive");
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
	let selIndex = getElementByID("modelsPills").value,
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
		let rbID = getCheckedByName(item).value;
		let rbVal = getCheckedByName(item + "_degree").value;
		toe += calcDegree(rbVal, rbID, "_center", pos1);
		antiSquat += calcDegree(rbVal, rbID, "center_", pos2);
		pivot += calcRollPivot(rbVal, rbID, "_center", "_in", selIndex);
		roll += calcRollPivot(rbVal, rbID, "center_", "down_", selIndex);
	})
	setTextByID("toe", toe);
	setTextByID("antisquat", antiSquat);
	setTextByID("roll", round(roll/2, 3));
	setTextByID("pivot", round(pivot/2, 3));
}

//oil mixing
function calculateOil() {
	let viscA = getElementByID("viscA").value,
		viscB = getElementByID("viscB").value,
		target = getElementByID("target").value;
	setTextByID("percentA","---");
	setTextByID("percentB","---");
	if (validateNumber([viscA, viscB, target])) {
		if (targetInRange(target,viscA,viscB)) {
			let partA = ((Math.log(target) - Math.log(viscB)) / (Math.log(viscA) - Math.log(viscB)));
			setTextByID("percentA",round(partA*100, 0));
			setTextByID("percentB",round((1 - partA)*100, 0));
		} else {
			alert("Target viscosity must fall between the viscosities of fluid A and fluid B!");
		}
	}
}

//gear ratio: spur / pinion * trans
function calculateGear() {
	let transmission = getElementByID("modelsGears").value,
		spur = getElementByID("spur").value,
		pinion = getElementByID("pinion").value,
		tire = getElementByID("tire").value;
	setTextByID("final","---");
	setTextByID("rollout","---");
	if (validateNumber([spur, pinion])) {
		let finalGear = (spur / pinion) * transmission;
		setTextByID("final",round(finalGear, 3));
		if (validateNumber([tire])) setTextByID("rollout",round((tire * 3.1415) / finalGear, 3));
	}
}

