let bwt=[];
let pointTable;

function fnStart() {
    rst();
    const input="$"+document.getElementById('input').value.replace("$","");
   let rotations=[];
    for(let i=0; i<input.length;i++){
        rotations[i]=rotation(input, i);
    }
    //rotations.sort();
    computeRotations(rotations)
    showRotations(rotations);
    bwt=burrowWheelerTransform(rotations);
    buildBWT(bwt);
    buildC(input);
    buildOccTable(bwt.split(""));
}/**
 * sorts rotations and saves the original pointer of the word
 */
function computeRotations(rotations){
    pointTable=[];
    let tempPoints=[];
    for (let i = 0; i < rotations.length; i++) {
        tempPoints[i]=[];
        tempPoints[i]=[rotations[i],i].slice();
    }
    tempPoints.sort(function(a, b) {
        return ((a[0] < b[0]) ? -1 : ((a[0] == b[0]) ? 0 : 1));
    });
    for (let i = 0; i < rotations.length; i++) {
        pointTable[i] = tempPoints[i][1];
        rotations[i]=tempPoints[i][0];
    }
    //alert(rotations);
}

function burrowWheelerTransform(rotations){
    let bwtOutput=[];
    const length= rotations.length;
    for(let i=0; i<length;i++){
        bwtOutput[i]=rotations[i][length-1];
    }
    return bwtOutput.join("");
} 
function buildBWT(bwt){
    const op =document.createElement("div");
    op.innerText=bwt;
    op.style="border: solid 3px darkgreen; font-size: larger;text-align: center;padding: 20px;";
    document.getElementById("bwt").appendChild(op );

}


function showRotations(rotations){
    const container= document.getElementById("rotations");
    for (let i = 0; i < rotations.length; i++) {
        const element =document.createElement("div");
        element.className="occ-cell";
        element.innerText=rotations[i];
        element.style="grid-row:"+(i+1)+"; grid-column:2";
        container.appendChild(element);


        const originalIndex =document.createElement("div");
        originalIndex.className="occ-cell head-cell";
        originalIndex.innerText=i;
        originalIndex.style="grid-row:"+(i+1)+"; grid-column:3";
        container.appendChild(originalIndex);


        const index =document.createElement("div");
        index.className="occ-cell head-cell";
        index.innerText=pointTable[i];
        index.style="grid-row:"+(i+1)+"; grid-column:1";
        container.appendChild(index);
    }
}
function createOccTab(bwt){
    let occValue=[];
    let valuesForLetter=[];
    const letters=getUsedSymbols(bwt);
    for (let j = 0; j < letters.length; j++) {
        occValue[j] = 0;
    }
    
    for(let i=0;i <bwt.length;i++){
    let char =bwt[i];
        occValue[letters.indexOf(char)]++;
        
        valuesForLetter[i]=occValue.slice();
    }
    return [ letters, valuesForLetter];
}
function buildOccTable(bwt){
    const occTable= document.getElementById("occ");
    const table=createOccTab(bwt);
    const letters=table[0];
    const valuesForLetter=table[1];
    occTable.style="grid-template-rows:"+(1+bwt.length)+"; grid-template-columns:"+letters.length+";";
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        let cell=document.createElement("div");
        cell.className="occ-cell head-cell";
        cell.style="grid-row:"+(i+3)+"; grid-column:1;";
        cell.textContent=letter;
        occTable.appendChild(cell);
    }
    for(let k=0;k<bwt.length;k++){
        let letter=bwt[k];
        let cell=document.createElement("div");
            cell.className="occ-cell head-cell";
            cell.style="grid-row:2; grid-column:"+(k+2)+";";
            cell.textContent=letter;
            occTable.appendChild(cell);
        let cella=document.createElement("div");
            cella.className="occ-cell";
            cella.style="grid-row:1; grid-column:"+(k+2)+";";
            cella.textContent=k;
            occTable.appendChild(cella);
        let row=3;
        valuesForLetter[k].forEach(value => {
            let cell=document.createElement("div");
            cell.className="occ-cell";
            cell.style="grid-row:"+row+"; grid-column:"+(k+2)+";";
            cell.textContent=value;
            occTable.appendChild(cell);
            row++;
        });
    }

}

function getUsedSymbols(string){
    let letters=[];
    let j=0;
    for (let i = 0; i < string.length; i++) {
        if(!letters.includes(string[i])){
            letters[j] = string[i];
            j++;
        }
    }
    letters.sort();
    return letters;
}

function createC(string){
    let letters=getUsedSymbols(string);
    let cOfLetter=[];
    
    cOfLetter[0]=0;

    let sum=0;
    for(let i =0; i<letters.length;i++){
        let char=letters[i];
       let app =  getNumberOfAppearances(string.split(""), char);
        cOfLetter[i+1]=app+sum;//i+1
        sum+=app;
    }
    let weirdOut=[];
    weirdOut[0]=letters;
    weirdOut[1]=cOfLetter;
    return weirdOut;
}


function buildC(string){
    const table=document.getElementById("C");
    const ccc=createC(string);
    const letters=ccc[0];
    const cOfLetter=ccc[1];
    
    for (let i = 0; i < letters.length; i++) {
        let letterCell = document.createElement("div");
        letterCell.className="occ-cell head-cell";
        letterCell.style="grid-row-start:1; grid-row-end:1"
        letterCell.innerText=letters[i];
        let cellC=document.createElement("div");
         cellC.className="occ-cell";
         cellC.style="grid-row-start:2; grid-row-end:2"
         cellC.innerText=cOfLetter[i];
        table.appendChild(cellC);
        table.appendChild(letterCell);
    }
    
  }

  function getNumberOfAppearances(string, char){
    let app=0;
    string.forEach(element => {
        if(element==char){
            app++;
        }
    });
    return app;
  }

function rotation(string, index){
    let outString=[];
    const stringArray=string.split("");
    for(let i=index;i<string.length;i++){
        outString[i-index]=stringArray[i];
    }
    const pos=outString.length;
    for(let j=0;j<index;j++){
        outString[pos+j]=stringArray[j];
    }
    return outString.join("");
  }


//let decoded=[];
let bwtWord;
let cccc;
let occOfL;
function decode(){
    bwtWord=document.getElementById('input').value.split("");
    cccc=createC(bwtWord.join(""));
    occOfL=createOccTab(bwtWord);
    const startIndex=bwtWord.indexOf("$");
    let result=decodeStep(lfMap(startIndex));
    if (result.indexOf("$")!=result.lastIndexOf("$")||result.indexOf("$")==-1)
        {result=")...ppuS toN("+result;}
    document.getElementById("reverseBwt").innerHTML =('<div style="font-size: small;">REVERSE:</div>'+ result.split("").reverse().join("").replace("$",""));
}
function lfMap(index){
    if(index>=bwtWord.length)
    return 0;
    const pos=cccc[0].indexOf(bwtWord[index]);
    return (cccc[1][pos]+  occOfL[1][index][pos]-1)
}
/**
 * 
 * @param {int} index 
 * @returns decode substring 
 */
function decodeStep(index){
    if(bwtWord[index]!="$"){
        let out=bwtWord[index]+decodeStep(lfMap(index));
        return out;}
    return "";
}
/**
 * resets containers
 */
function rst(){
    let rs=["occ","C","bwt","rotations"];
    rs.forEach(element => {
        document.getElementById(element).innerHTML="";
    });
    
}
/**
 * 
 * @param {char} char 
 * @return {int[]} range where char appears in F 
 */
function rangeInFcolumn(char){
    let upper;
    let lower;
    const pos=cccc[0].indexOf(char);
    const cOfChar=cccc[1][pos];
    const cOfnext=cccc[1][pos+1];
    upper=cOfChar;
    lower=cOfnext;
    return[upper,lower];
}

function inexactMatching(){
    if(bwt.length==0){
        document.getElementById("matchingZone").innerHTML="Please encode a string before";
        return;
    }
    bwtWord=bwt;
    occOfL=createOccTab(bwt);
    cccc=createC(bwt);
    const maxDifferences=1;//todo get from dom
    const D=1;
    let errorFound=[];
    const bwtAr=bwt.split("");
    const pattern=document.getElementById("pattern").value.split("").reverse();
    let range=rangeInFcolumn(pattern[0]);
    let matches=[];
    let pointers=[];
    for(let i=0; i<range[1]-range[0]; i++){
        matches[i]=[];
        pointers[i]=[];
        pointers[i][0]=pattern[0];
        pointers[i][1]=i+range[0];
        pointers[i][2]=0;
    }
    for(let i=0; i<pointers.length; i++){
        recc(0);
        function recc(indexk){
            
            if(pointers[i][0]!=pattern[indexk])
                {pointers[i][2]++}
            matches[i][indexk]=pointers[i][0];
            if(pointers[i][2]>maxDifferences){
                matches[i][0]="/";
                return;
            }if(indexk==pattern.length-1){
                return;
            }
            pointers[i][0]=bwtAr[pointers[i][1]];
            pointers[i][1]=lfMap(pointers[i][1]);
            recc(indexk+1);
        }
    }
    printAlingments(matches,pointers);
}


function printAlingments(matches, pointers){
    const zone=document.getElementById("matchingZone");
    zone.innerHTML="";
    let decentMatches=0;
    
    for (let i = 0; i < matches.length; i++) {
        let el=document.createElement("div");
       if(matches[i][0]!="/"){
            decentMatches++;
            el.innerText="matched => '"+matches[i].reverse().join("")+"' position : "+pointTable[pointers[i][1]]+"; mismatches : "+pointers[i][2]+"    ";
            el.className="match";
            zone.appendChild(el);
       }
    }
    let info=document.createElement("div");
    info.className="match head-cell";
    info.textContent="Number of matches : "+decentMatches;
    zone.insertBefore(info,zone.children[0]);
} 

