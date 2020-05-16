//common
function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
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
function resetInput(id) {
	document.querySelector("input[id = '" + id + "']").value = "";
}
function resetSelect(id) {
	document.querySelector("select[id = '" + id + "']").selectedIndex = 0;
}
function resetResult(id) {
	document.querySelector(".result[id = '" + id + "']").innerHTML = "---";
}

//pill arms

function manageRadios(sel) {
	let arm1 = sel + "L";
	let arm2 = sel + "R";
	//get selected position
	let pos = document.querySelector("input[name = '" + arm1 + "']:checked").value;
	//select passive arm
	document.querySelector("input[name='" + arm2 + "']:checked").disabled = true;
	let passive = document.querySelector("input[name='" + arm2 + "'][value='" + pos + "']");
	passive.checked = true;
	passive.disabled = false;
	//manage degrees
	let degRads = document.querySelectorAll("input[name='" + sel + "_degree']");
	passive = document.querySelectorAll("input[name='" + sel + "_degreeR']");
	if (pos == "center_center") {
		degRads[0].checked = true;
		degRads[0].disabled = false;
		degRads[1].disabled = true;
		degRads[2].disabled = true;
		degRads[3].disabled = true;
		degRads[4].disabled = true;
		passive[0].checked = false;
		passive[0].disabled = true;
		passive[1].checked = false;
		passive[1].disabled = true;
	} else {
		if (degRads[0].checked == true) degRads[1].checked = true;
		else if (degRads[3].checked == false || degRads[4].checked == false) {
			passive[0].checked = false;
			passive[0].disabled = true;
			passive[1].checked = false;
			passive[1].disabled = true;
		}
		if (pos.includes("center")) {
			degRads[0].disabled = true;
			degRads[1].disabled = false;
			degRads[2].disabled = false;
			degRads[3].disabled = true;
			degRads[4].disabled = true;
			passive[0].checked = false;
			passive[0].disabled = true;
			passive[1].checked = false;
			passive[1].disabled = true;
			if (degRads[3].checked == true || degRads[4].checked == true) degRads[1].checked = true;
		} else {
			degRads[0].disabled = true;
			degRads[1].disabled = false;
			degRads[2].disabled = false;
			degRads[3].disabled = false;
			degRads[4].disabled = false;
			if (degRads[3].checked == true || degRads[4].checked == true) {
				if (degRads[3].checked == true) {
					passive[0].checked = true;
					passive[0].disabled = false;
					passive[1].disabled = true;
				} else {
					passive[1].checked = true;
					passive[1].disabled = false;
					passive[0].disabled = true;
				}
						

			}
		}
	}
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
	function quantRollPivot(quant, id, center, pos) {
		quant = Math.abs(calcDegree(quant, id, center, pos));
		if (quant == 0.5) quant = 0.35;
		else if (quant == 1.0) quant = 0.7;
		if (id.includes(pos)) quant *= -1;
		return quant;
	}
	let toe = 3,
		antiSquat = 1,
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
		let rbID = document.querySelector("input[name='" + item + "L']:checked").value;
		let rbVal = document.querySelector("input[name='" + item + "_degree']:checked").value;
		toe += calcDegree(rbVal, rbID, "_center", pos1);
		antiSquat += calcDegree(rbVal, rbID, "center_", pos2);
		pivot += quantRollPivot(rbVal, rbID, "_center", "_in");
		roll += quantRollPivot(rbVal, rbID, "center_", "down_");
	})
	document.querySelector(".result[id='toe']").innerHTML = toe;
	document.querySelector(".result[id='antisquat']").innerHTML = antiSquat;
	document.querySelector(".result[id='roll']").innerHTML = round(roll/2, 3);
	document.querySelector(".result[id='pivot']").innerHTML = round(pivot/2, 3);
}
function doPillFuncs(inArm) {
	manageRadios(inArm);
	calculatePills();
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
function fillModels() {
	let rcModels = [
		["ae B6",2.60],
		["ae B6.1",2.60],
		["ae B6.2",2.60],
		["tlr 22",2.43]
	];
	let select_elem = document.querySelector("select[id = 'models']");
	rcModels.forEach(function (item, index) {
		let option_elem = document.createElement('option');
		option_elem.textContent = item[0];
		option_elem.value = item[1];
		select_elem.appendChild(option_elem);
	});
}
function calculateGear(btnObj) {
	btnObj.blur();
	let spur = document.querySelector("input[id = 'spur']").value,
		pinion = document.querySelector("input[id = 'pinion']").value,
		transmission = document.querySelector("select[id = 'models']"),
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
	resetSelect('models');
	resetInput('spur');
	resetInput('pinion');
	resetInput('tire');
	resetResult('final');
	resetResult('rollout');
}

//navigation
function activatePage(navId) {
	// change nav border
	let container = document.querySelectorAll('.navCtrl');
	container.forEach(function (item) {
		item.style.color = (item.id == 'nav' + navId) ? 'var(--paper)' : 'black';
	});
	//switch pages
	container = document.querySelectorAll('.pageCtrl');
	container.forEach(function (item) {
		item.style.display = (item.id == 'page' + navId) ? 'block' : 'none';
	});
}