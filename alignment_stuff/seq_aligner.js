let match;
let mismatch;
let insdel;
let word1;
let word2;
let table;
 /**
  * boolean, is a Local align or not
  */
let localAlgin;
/**
 * 
 * @param {boolean} isLocal 
 */
function start(isLocal){
    localAlgin=isLocal;
    getValues();
    prepareTable(isLocal);
    recScoring(table.length-1,word2.length-1,isLocal);
    printTable();
    score=0;
}
/**
 * Saves values from the user input 
 *  (word1, word2, match, mismatch, insdel)
 * 
 */
function getValues(){
     document.getElementById("tableZone").innerHTML="";
    match=Number(document.getElementById("match").value); 
    mismatch=Number(document.getElementById("mismatch").value); 
    insdel=Number(document.getElementById("insert_delete").value); 
    // alert(match+ " "+ mismatch +" "+insdel+"\n"+(mismatch+insdel))
    word1="*"+document.getElementById("word1").value.replace(" ",""); 
    word2="*"+document.getElementById("word2").value.replace(" ",""); 
}
/**
 * initialize the table and fills the first row and first column
 * @param {boolean} isLocal
 */
function prepareTable(isLocal){
    table=[];
    const T=((isLocal)? 0:1 );
    for (let i = 0; i < word1.length; i++) {
            table[i] =[];
            for (let j = 0; j < word2.length; j++) {
                table[i][j] =[];
                table[i][j][0]=0;
                table[i][j][1]=[0,0,0];
                table[0][j][0]=(j*insdel*T);
                table[0][j][1]=[0,0,T];
            }
            table[i][0][0]=(i*insdel*T);
            table[i][0][1]=[0,T,0];
        }
        table[0][0][1]=[0,0,0];
}
/**
 * this is the recoursive method that goes through the matrix and calculates the score of every cell
 * 
 * @param {int} ind1 index in word1
 * @param {int} ind2 index in word2
 * @param {boolean} isLocal the alignment is local or global
 * @returns 
 */
function recScoring(ind1,ind2, isLocal){
    if(ind1==0||ind2==0){
        return table[ind1][ind2][0];
    }

    let matchScore;
    if(word1[ind1]==word2[ind2]){
        matchScore=match+recScoring(ind1-1,ind2-1,isLocal);
    }else matchScore=mismatch+recScoring(ind1-1,ind2-1, isLocal);    
    const del1Score=insdel+recScoring(ind1-1,ind2, isLocal);
    const del2Score=insdel+recScoring(ind1,ind2-1, isLocal);

    const mexerboi=[matchScore,del1Score,del2Score];
    if(isLocal){
        mexerboi[3]=0;
    }

    const max=massimo(mexerboi);
    let traces=[];
    for (let i = 0; i < mexerboi.length; i++) {
        if(i== mexerboi.indexOf(max,i)){
            traces[i]=1;
        }else {traces[i]=0;}
    }
    saveCellScore(ind1,ind2,max,traces);
    return max
}
/**
 * 
 * @param {array} array 
 * @returns the maximal value in the array
 */
function massimo(array){
    let max=array[0];
    for (let i = 0; i < array.length; i++) {
        if(array[i]>max)
        {max = array[i];}
    }
    return max;
}
/**
 * 
 * @param {int} ind1 
 * @param {int} ind2 
 * @param {int} score score in this cell
 * @param {array} trace array cointining the information needed for the traceback
 */
function saveCellScore(ind1,ind2,score,trace){
    table[ind1][ind2][0]=score;
    if(score==0 && localAlgin){table[ind1][ind2][1]=[0,0,0];}
    else{table[ind1][ind2][1]=trace;}
}

/**
 * list of all the alignments with max score
 */
let bestWords;

/**
 * searches and saves in bestWords[] all the alignments with max score
 */
function findBest(){
    let start=table[word1.length-1][word2.length-1];
    bestWords=[];
    bestWords[0]=[];
    nuWordCounter=0;
    if(localAlgin){
        const maxScoreCells=getMaxScoreCells();
        for (let i = 0; i < maxScoreCells.length; i++) {
            const element = maxScoreCells[i];
            traceBackWord(element[0],element[1],nuWordCounter);
            nuWordCounter++;
            bestWords[nuWordCounter]=[];
        }
    }else{
        const score=start[0];
        traceBackWord(word1.length-1,word2.length-1,0); 
    }
    writeAlignment();
}
/**
 * @returns {array} array of coordinates of every cell with max score
 */
function getMaxScoreCells(){
    let maxScore=0;
    let maxedCells=[];
   for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < word2.length; j++) {
            if(table[i][j][0]>maxScore){
                maxScore=table[i][j][0];
                maxedCells=[];
            }
            if(table[i][j][0]==maxScore && maxScore!=0){
                maxedCells[maxedCells.length]=[i,j];
            }
        }
    }   
    return maxedCells;
}
   

/**
 * writes in the html div all the max score alignments in bestWords[]
 */
function writeAlignment(){
    const zone =document.getElementById("alignments");
    zone.innerHTML="";
    for (let i = 0; i < bestWords.length; i++) {
        let txt1="";
        let txt2="";
        let txtConf="";
        for (let le = 0; le < bestWords[i].length; le++) {
            txt1 += bestWords[i][le][0];
            txt2+=bestWords[i][le][1];
            if(bestWords[i][le][0]==bestWords[i][le][1])
            {txtConf+="+"}
            else if(bestWords[i][le][0]=="_"||bestWords[i][le][1]=="_"){
                txtConf+="_";
            }else{txtConf+="/";}
            
        }
        const sol=document.createElement("div");
        sol.className="solution";
        sol.innerHTML+="<div class='txt'>"+txt1.replace("*","").split("").reverse().join("")+"</div>"
        sol.innerHTML+="<div class='txt'>"+txtConf.replace("*","").split("").reverse().join("")+"</div>";

        sol.innerHTML+="<div class='txt'>"+txt2.replace("*","").split("").reverse().join("")+"</div>"
        zone.appendChild(sol);
    }
}
let nuWordCounter;

/**
 * 
 * @param {int} ind1 index in word1
 * @param {int} ind2 index in word2
 * @param {int} wordPointer the position of the word currently in tracing inside bestWords[]
 */
function traceBackWord(ind1, ind2, wordPointer){
    addTocoloredPath(ind1,ind2);
    const cell=table[ind1][ind2];    
    let anynew=0;
    let thisPosition;
    //match and mismatch
    if(cell[1][0]==1){
        let last=bestWords[wordPointer].length;
        bestWords[wordPointer][last]=[];
        bestWords[wordPointer][last][0]=word1[ind1];
        bestWords[wordPointer][last][1]=word2[ind2];
        thisPosition=last;

        traceBackWord(ind1-1,ind2-1,wordPointer);
        anynew++;
    
    }
    //insertion in word2
    if(cell[1][1]==1){
        let ind;
        if(anynew !=0){
            nuWordCounter++;
            ind=nuWordCounter;
            bestWords[ind]=bestWords[wordPointer].slice(0,thisPosition);
        }else
        { ind=wordPointer;
        }
        let last=bestWords[ind].length;
        bestWords[ind][last]=[];
        bestWords[ind][last][0]=word1[ind1];
        bestWords[ind][last][1]="_";
        thisPosition=last;

        traceBackWord(ind1-1,ind2,ind);
        anynew ++;
    }
    //insertion in word1
    if(cell[1][2]==1){
        let ind;
        if(anynew !=0){
            nuWordCounter++;
            ind=nuWordCounter;
            bestWords[ind]=bestWords[wordPointer].slice(0,thisPosition);
        }else{ ind=wordPointer;}
        let last=bestWords[ind].length;
        bestWords[ind][last]=[];
        bestWords[ind][last][1]=word2[ind2];
        bestWords[ind][last][0]="_";

        traceBackWord(ind1,ind2-1,ind);
    }
}

/**
 * coordinates of every cell that are used for a max score path
 */
let pathcolored=[];
function addTocoloredPath(ind1, ind2){
    pathcolored[0][pathcolored[0].length]=ind1;
    pathcolored[1][pathcolored[1].length]=ind2;
}
function isInPath(ind1,ind2) {
    for (let i = 0; i < pathcolored[0].length; i++) {
        if(pathcolored[0][i]==ind1 && pathcolored[1][i]==ind2) {
            return true;
        }       
    }
    return false;
}

/**
 * prints the dynamic matrix with scores and traceback pointers to screen
 */
function printTable(){
    pathcolored=[];
    pathcolored[0]=[];
    pathcolored[1]=[];
    findBest();

    const tab=document.getElementById("tableZone");
    tab.style="grid-template-columns:"+(word1.length)+"; grid-template-rows:"+(word2.length)+";";
    for (let i = 0; i < word1.length; i++) {
        let element=document.createElement("div");
        element.style="grid-row:1;grid-column:"+(i+2)+";";
        element.className="table-cell cell-head";
        element.innerText= word1[i];
        tab.appendChild(element);
        
    }

    for (let i = 0; i < word2.length; i++) {
        let element=document.createElement("div");
        element.style="grid-row:"+(i+2)+";grid-column:1;";
        element.className="table-cell cell-head";
        element.innerText= word2[i];
        tab.appendChild(element);
    }
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < word2.length; j++) {
            let element=document.createElement("div");
            element.style="grid-row:"+(j+2)+";grid-column:"+(i+2)+";";
            element.className="table-cell";
            if(isInPath(i,j)){element.className+=" cell-path"}
            if(i!=0 || j!=0){
                element.innerHTML="";
                for (let k = 0; k < table[i][j][1].length; k++) {
                    if( table[i][j][1][k] == 1)
                    {   element.innerHTML+='<div class="arrowContainer arrow'+k+'" style=""><div  class="arrowStick"></div><div style="right: -65px;" class="arrowHead"></div>   </div>';
                    }
                    
                }
                if(i+1==table.length&&word2.length-1==j&&!localAlgin){
                    element.innerHTML+="<div style=' position: absolute;transform: translateX(31px);' class='txt'> <== score</div>";
                    element.className+=" superCell";
                }
            }
            element.innerHTML+=table[i][j][0];
            tab.appendChild(element);
        }
    }
}
