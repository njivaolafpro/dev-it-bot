const generateRandom = (max: number)=>{
    // 2. PASS
    const randomNumIntoMax = Math.random() * max;   // nombre decimal
    return Math.round(randomNumIntoMax);
}

export { generateRandom };
