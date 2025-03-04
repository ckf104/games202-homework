function getRotationPrecomputeL(precompute_L, rotationMatrix) {
	let rot = mathMatrix2mat3Matrix(rotationMatrix);
	let rot_inv = math.transpose(rot);
	let mat33t = computeSquareMatrix_3by3(rot_inv);
	let mat55t = computeSquareMatrix_5by5(rot_inv);

	let precompute_LR = [precompute_L[0][0], precompute_L[1][0], precompute_L[2][0],
	precompute_L[3][0], precompute_L[4][0], precompute_L[5][0],
	precompute_L[6][0], precompute_L[7][0], precompute_L[8][0]];

	let precompute_LG = [precompute_L[0][1], precompute_L[1][1], precompute_L[2][1],
	precompute_L[3][1], precompute_L[4][1], precompute_L[5][1],
	precompute_L[6][1], precompute_L[7][1], precompute_L[8][1]];

	let precompute_LB = [precompute_L[0][2], precompute_L[1][2], precompute_L[2][2],
	precompute_L[3][2], precompute_L[4][2], precompute_L[5][2],
	precompute_L[6][2], precompute_L[7][2], precompute_L[8][2]];

	let precompute_LR_rot33 = math.multiply(mat33t, precompute_LR.slice(1, 4));
	let precompute_LG_rot33 = math.multiply(mat33t, precompute_LG.slice(1, 4));
	let precompute_LB_rot33 = math.multiply(mat33t, precompute_LB.slice(1, 4));
	let precompute_LR_rot55 = math.multiply(mat55t, precompute_LR.slice(4, 9));
	let precompute_LG_rot55 = math.multiply(mat55t, precompute_LG.slice(4, 9));
	let precompute_LB_rot55 = math.multiply(mat55t, precompute_LB.slice(4, 9));

	let precompute_LR_rot = math.concat([precompute_LR[0]], precompute_LR_rot33, precompute_LR_rot55).toArray();
	let precompute_LG_rot = math.concat([precompute_LG[0]], precompute_LG_rot33, precompute_LG_rot55).toArray();
	let precompute_LB_rot = math.concat([precompute_LB[0]], precompute_LB_rot33, precompute_LB_rot55).toArray();

	var precompute_L_rot = new Array(9);
	for (let i = 0; i < 9; i++) {
		precompute_L_rot[i] = [precompute_LR_rot[i], precompute_LG_rot[i], precompute_LB_rot[i]];
	}

	return precompute_L_rot;
}

function computeSquareMatrix_3by3(rotationMatrix) { // 计算方阵SA(-1) 3*3 

	// 1、pick ni - {ni}
	let n1 = [1, 0, 0]; let n2 = [0, 0, 1]; let n3 = [0, 1, 0];

	// 2、{P(ni)} - A  A_inverse
	let rot_n1 = math.multiply(rotationMatrix, n1).toArray();
	let rot_n2 = math.multiply(rotationMatrix, n2).toArray();
	let rot_n3 = math.multiply(rotationMatrix, n3).toArray();

	let sh1 = SHEval3(n1[0], n1[1], n1[2]).slice(1, 4);
	let sh2 = SHEval3(n2[0], n2[1], n2[2]).slice(1, 4);
	let sh3 = SHEval3(n3[0], n3[1], n3[2]).slice(1, 4);

	let PXt = math.matrix([sh1, sh2, sh3]);

	let rot_sh1 = SHEval3(rot_n1[0], rot_n1[1], rot_n1[2]).slice(1, 4);
	let rot_sh2 = SHEval3(rot_n2[0], rot_n2[1], rot_n2[2]).slice(1, 4);
	let rot_sh3 = SHEval3(rot_n3[0], rot_n3[1], rot_n3[2]).slice(1, 4);

	let PRXt = math.matrix([rot_sh1, rot_sh2, rot_sh3]);

	// 3、用 R 旋转 ni - {R(ni)}
	let PXt_inv = math.inv(PXt);
	let Mt = math.multiply(PXt_inv, PRXt);
	return Mt;

	// 4、R(ni) SH投影 - S

	// 5、S*A_inverse

}

function computeSquareMatrix_5by5(rotationMatrix) { // 计算方阵SA(-1) 5*5

	// 1、pick ni - {ni}
	let k = 1 / math.sqrt(2);
	let n1 = [1, 0, 0]; let n2 = [0, 0, 1]; let n3 = [k, k, 0];
	let n4 = [k, 0, k]; let n5 = [0, k, k];

	// 2、{P(ni)} - A  A_inverse
	let rot_n1 = math.multiply(rotationMatrix, n1).toArray();
	let rot_n2 = math.multiply(rotationMatrix, n2).toArray();
	let rot_n3 = math.multiply(rotationMatrix, n3).toArray();
	let rot_n4 = math.multiply(rotationMatrix, n4).toArray();
	let rot_n5 = math.multiply(rotationMatrix, n5).toArray();

	let sh1 = SHEval3(n1[0], n1[1], n1[2]).slice(4, 9);
	let sh2 = SHEval3(n2[0], n2[1], n2[2]).slice(4, 9);
	let sh3 = SHEval3(n3[0], n3[1], n3[2]).slice(4, 9);
	let sh4 = SHEval3(n4[0], n4[1], n4[2]).slice(4, 9);
	let sh5 = SHEval3(n5[0], n5[1], n5[2]).slice(4, 9);

	let PXt = math.matrix([sh1, sh2, sh3, sh4, sh5]);

	let rot_sh1 = SHEval3(rot_n1[0], rot_n1[1], rot_n1[2]).slice(4, 9);
	let rot_sh2 = SHEval3(rot_n2[0], rot_n2[1], rot_n2[2]).slice(4, 9);
	let rot_sh3 = SHEval3(rot_n3[0], rot_n3[1], rot_n3[2]).slice(4, 9);
	let rot_sh4 = SHEval3(rot_n4[0], rot_n4[1], rot_n4[2]).slice(4, 9);
	let rot_sh5 = SHEval3(rot_n5[0], rot_n5[1], rot_n5[2]).slice(4, 9);

	let PRXt = math.matrix([rot_sh1, rot_sh2, rot_sh3, rot_sh4, rot_sh5]);

	// 3、用 R 旋转 ni - {R(ni)}
	let PXt_inv = math.inv(PXt);
	let Mt = math.multiply(PXt_inv, PRXt);
	return Mt;

	// 4、R(ni) SH投影 - S

	// 5、S*A_inverse

}

function mat4Matrix2mathMatrix(rotationMatrix) {

	let mathMatrix = [];
	for (let i = 0; i < 4; i++) {
		let r = [];
		for (let j = 0; j < 4; j++) {
			r.push(rotationMatrix[i * 4 + j]);
		}
		mathMatrix.push(r);
	}
	return math.matrix(mathMatrix)

}

function mathMatrix2mat3Matrix(rotationMatrix) {

	let mathMatrix = [];
	for (let i = 0; i < 3; i++) {
		let r = [];
		for (let j = 0; j < 3; j++) {
			r.push(rotationMatrix[i + j * 4]);
		}
		mathMatrix.push(r);
	}
	return math.matrix(mathMatrix)

}

function getMat3ValueFromRGB(precomputeL) {

	let colorMat3 = [];
	for (var i = 0; i < 3; i++) {
		colorMat3[i] = mat3.fromValues(precomputeL[0][i], precomputeL[1][i], precomputeL[2][i],
			precomputeL[3][i], precomputeL[4][i], precomputeL[5][i],
			precomputeL[6][i], precomputeL[7][i], precomputeL[8][i]);
	}
	return colorMat3;
}