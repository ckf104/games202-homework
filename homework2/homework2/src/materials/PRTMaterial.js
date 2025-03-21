class PRTMaterial extends Material {

  constructor(vertexShader, fragmentShader) {
    // let colorMat3 = getMat3ValueFromRGB(precomputeL[guiParams.envmapId]);
    super({
      'uPrecomputeLR': { type: 'updatedInRealTime', value: null },
      'uPrecomputeLG': { type: 'updatedInRealTime', value: null },
      'uPrecomputeLB': { type: 'updatedInRealTime', value: null },
    },[
        'aPrecomputeLT'
      ], vertexShader, fragmentShader, null);
  }
}

async function buildPRTMaterial(vertexPath, fragmentPath) {


  let vertexShader = await getShaderString(vertexPath);
  let fragmentShader = await getShaderString(fragmentPath);

  return new PRTMaterial(vertexShader, fragmentShader);
}