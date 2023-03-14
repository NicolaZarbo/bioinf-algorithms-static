
let nWords;
function printInputZone(){
    nWords=0;
    const num=Number(document.getElementById("nOfWords").value);
    const zone=document.getElementById("inputZone");
    zone.innerHTML="";
    if(num>nWords){
        for (let i = (nWords); i < num; i++) {
            zone.innerHTML+="<div><input pattern='[a,c,g,t,A,C,G,T]+' class='inputWords' id='inputW"+i+"' type='text'>W"+i+"</div>";
        }
    }else{
        for(let i=nWords;i>num;i--){
            zone.lastChild.remove();
        }
    }
    nWords=num;
    treeGenerator();
}


let nodeArray;
let maxDepth;
let rowsOfTreeHtml;

function treeGenerator(){
    let wordNumber=nWords;
    rowsOfTreeHtml=[];
    nodeArray=[];
    maxDepth=0;
    const zone=document.getElementById("treeZone");
    zone.innerHTML="";
    const htmlRow=document.createElement("div")
    htmlRow.style="display:grid; justify-items: center; grid-template-columns:"+getGridColumnForStyle(wordNumber)+";";
    rowsOfTreeHtml[0]=htmlRow;
    
    for (let i = 0; i < wordNumber; i++) {
        const elem=document.createElement("div");
        elem.className="nodeButton";
        elem.innerText="W"+i;
        elem.style="grid-row:1";
        elem.setAttribute("onclick","relateNodes("+i+")")
        let node={
            matchWith: -1,
            key:i,
            depth:0,
            ownElement:elem
        }
        nodeArray[nodeArray.length]=node;
        htmlRow.appendChild(elem);
    }
    zone.appendChild(htmlRow);
       savedNode=null;
    
    
}

let savedNode;
function relateNodes(key){
    if(nodeArray[key].matchWith!=-1){
        return;
    }
    if(savedNode==null){

        savedNode=nodeArray[key];
        savedNode.ownElement.className+=" node-selected";
    }else{
        if(key==savedNode.key){
            return;
        }
        nodeArray[key].matchWith=savedNode.key;
        savedNode.matchWith=key;
        setVisiblyUsed(nodeArray[key],savedNode);
        
        newNode(nodeArray[key],savedNode);
        savedNode=null;
    }
}
function setVisiblyUsed(node1, node2){
    node1.ownElement.className+=" node-used";
    node2.ownElement.className+=" node-used";
}
function joinWithStick(node1,node2){
    const n1=getNodeElCOrdinates(node1);
    const n2=getNodeElCOrdinates(node2);
    
    const vector=[(n1[0]-n2[0]),(n1[1]-n2[1])];
    let angle=findAngle(vector);
    let mod=vectorModule(vector);
    
    let pointX;
    let pointY;
    
    if(vector[0]<=0){
        pointX=n2[0]-(mod-vector[0])/2
        pointY=n1[1]-vector[1]/2;
    }else{
       pointX= n2[0]-(mod/2-vector[0]/2);
       pointY=n1[1]-vector[1]/2;
    }

    
    const color=getColorForDepth(node1.depth);
    const stick=document.createElement("div");
    stick.className="stick";
    stick.style="position:absolute;z-index:"+node1.depth+"; left:"+Math.round(pointX)+"px; top:"+Math.round(pointY)+"px; transform: rotate("+angle+"rad); width:"+mod+"; border-color:"+color+";";
    document.getElementById("treeZone").appendChild(stick);
}



function vectorModule(vector){
    return Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]);
}

function findAngle(vector){
    let modulesqr= vectorModule(vector);
    let angle;
    angle=Math.acos(vector[0]/modulesqr);
    return angle;
}

function getNodeElCOrdinates(node){
    const x=(node.ownElement.getBoundingClientRect().x+node.ownElement.getBoundingClientRect().right)/2;
    const y=(node.ownElement.getBoundingClientRect().y+node.ownElement.getBoundingClientRect().bottom)/2;
    return [x,y];
}
function getColorForDepth(depth){
    switch(depth%4){
        case 0:  return "#1EA896;"
        case 1: return "#511EA8"
        case 2: return "#A81E30"
        case 3: return "#75A81E"
    };
}
function getGridColumnForStyle(int){
    let tt="";
    for (let i = 0; i < int; i++) {
        tt+=" 1fr "
    }
    tt+=" ;"
    return tt;
}

function newNode(node1,node2){

    let fatherNode={
        child1:node1,
        child2:node2,
        matchWith: -1,
        key:nodeArray.length,
        depth:Math.max(node1.depth,node2.depth)+1,
        ownElement:""

    }
    nodeArray[nodeArray.length]=fatherNode;
    if(fatherNode.depth>maxDepth){
        maxDepth++;
        const htmlRow=document.createElement("div");
        htmlRow.style="display:grid;justify-items: center; grid-template-columns: "+getGridColumnForStyle(nWords-maxDepth)+";";
        document.getElementById("treeZone").appendChild(htmlRow);
        rowsOfTreeHtml[maxDepth]=htmlRow;
    }
    generateGuiNode(fatherNode);

}
function generateGuiNode(node){
    const elem=document.createElement("div");
    elem.className="nodeButton";
    elem.style="grid-row:"+node.depth+1;
    elem.innerText="key:"+node.key+" ("+node.child1.key+","+node.child2.key+")";
    elem.setAttribute("onclick","relateNodes("+node.key+")");
    node.ownElement=elem;
    rowsOfTreeHtml[node.depth].appendChild(elem);
    joinWithStick(node,node.child1);
    joinWithStick(node,node.child2);
}

let orderedTree;
function orderTree(){
    const ttt=nodeArray;
    orderedTree=[];
    let depthDim=0;
    for (let k = 0; k < maxDepth; k++) {
        orderedTree[k]=[];
        for (let i = 0; i < ttt.length; i++) {
            if(ttt[i].depth==k){
                orderedTree[k][depthDim]=ttt[i];
                depthDim++;
            }
        }
        depthDim=0;
    }
}
function printTree(){
    let txt="";
    const root=nodeArray[nodeArray.length-1];
    txt=recPrint(root);
    document.getElementById("txtTarget").innerText=txt;
}
function recPrint(node){
    if(node.depth>0){
        return " ("+recPrint(node.child1)+","+recPrint(node.child2)+" )";
    }else{
        return node.key+"";
    }
}



const rr=["a","c","g","t","_"];
let words;
let profiles;
let wordOfProileI;

function msa(){
    gapCost=-Number(document.getElementById("gapCost").value)
    mismatchCost=-Number(document.getElementById("mismCost").value)
    profilesIndex=0;
    const root=nodeArray[nodeArray.length-1];
    words=[];
    for (let i = 0; i < nWords; i++) {
        words[i]=document.getElementById("inputW"+i).value.toLowerCase();
        if(words[i].length==0){
            return //todo add a message for user
        }
    }
    profiles=[];
    wordOfProileI=[]
    for (let i = 0; i < nodeArray.length; i++) {
        profiles[i]=[]
        wordOfProileI[i]=0;
    }
    recProf(root.key);

    printProfile(root.key);
}
function printProfile(finalKey){
    const len=profiles[finalKey].length;
    const tab=document.getElementById("tableZone");
    tab.innerHTML="";
    tab.style="grid-template-rows:6; grid-template-columns:"+(len+1)+";";
    for (let i = 0; i < len; i++) {
        const element = document.createElement("div");
        const column=i+2;
        element.innerText=i;
        element.style="grid-row:1;grid-column:"+column+";";
        element.className="table-cell head-cell";
        tab.appendChild(element);
        for (let j = 0; j < rr.length; j++) {
            const weight = document.createElement("div");
            const row=j+2;
            weight.innerText=profiles[finalKey][i][j];
            weight.style="grid-row:"+row+";grid-column:"+column+";";
            weight.className="table-cell";
            tab.appendChild(weight);
        }        
    }
    for (let j = 0; j < rr.length; j++) {
        const element =document.createElement("div");
        const row=j+2;
        element.innerText=rr[j];
        element.className="table-cell head-cell";
        element.style="grid-row:"+row+";grid-column:1;";
        tab.appendChild(element);
    }   
}
function fakeProfile(word){
    let profile =[];
    for (let i = 0; i < word.length; i++) {
        profile[i]=probabilityOfLetter(word[i]);
    }
    return profile;
}
let key1;
let key2;
let profilesIndex;
/**
 * recursively clusters toghether the profiles, treats the original words as profile @see fakeProfile()
 * @param {int} key key of the profile
 * @returns 
 */
function recProf(key){
    if(nodeArray[key].depth==0 ){
        profiles[key]=fakeProfile(words[key])
        wordOfProileI[key]=1;
        //profilesIndex++;
       return profiles[key];
    }
    key1=nodeArray[key].child1.key;
    key2=nodeArray[key].child2.key;
    let locak1=key1;
    let locak2=key2;
    profiles[key]=mergeProfile(recProf(locak1), recProf(locak2) );
    wordOfProileI[key]=wordOfProileI[locak1]+wordOfProileI[locak2];
   // profilesIndex
    return profiles[key];
}
function mergeProfile(prof1, prof2){
    table=[];
    profile1=prof1;
    profile2=prof2;
    for (let i = 0; i < profile1.length; i++) {
        table[i]=[];
        for (let j = 0; j < profile2.length; j++) { 
           table[i][j]=[];
        }
        
    }
    table[0][0][1]=[0,0,0];
    recScoreStPr( profile1.length-1 , profile2.length-1)
    return buildProfileByTraceBack();
}
/**
 * this is only used when creating a fake profile from a word
 * @param {array} letterProb the row of the new profile
 * @param {character being checked} char1  
 */
function probabilityOfLetter(char){
    let ret=[];
    for (let i = 0; i < rr.length; i++) {
        ret[i]=0;
    }
    ret[rr.indexOf(char)]=1;
    return ret;
}

/**
 * calculates the score of cell taking into account both of the profiles' weights
 * @param {int} ind1 index of profile1
 * @param {int} ind2 index of profile2
 * @returns 
 */
function pDouble(ind1,ind2){
    sum=0;
    for (let i = 0; i < rr.length; i++) {
        sub=0;
        for (let j = 0; j < rr.length; j++) {
            if(rr[j]!=rr[i]){
                sub+=mismatchCost*profile1[ind1][j]
            }  
        }
        sum+=profile2[ind2][i]*sub;
        sub=0;
    }
    return sum;
}

let mismatchCost;
let gapCost;
let table;
let profile1;
let profile2;
/**
 * Fills the alignment matrix recursively
 * @param {int} ind1 index of profile1
 * @param {int} ind2 index of profile2
 * @returns score of cel (ind1,ind2)
 */
function recScoreStPr(ind1,ind2){
    if(ind1==0&&ind2==0){
        return -pDouble(ind1,ind2);
    }
    if(ind1==0){
        const score=-gapCost+recScoreStPr(ind1,ind2-1);
        saveCellScore1(ind1,ind2,score,[0,0,1]);
        return score
    }
    if(ind2==0){
        const score=-gapCost+recScoreStPr(ind1-1,ind2);
        saveCellScore1(ind1,ind2,score,[0,1,0]);
        return  score;
    }

    let matchScore=-pDouble(ind1-1,ind2-1)+recScoreStPr(ind1-1,ind2-1);
    let gap1Score=-gapCost+recScoreStPr(ind1-1,ind2);  
    let gap2Score=-gapCost+recScoreStPr(ind1,ind2-1);

    
    const mexerboi=[matchScore,gap1Score,gap2Score];
    const max=massimo(mexerboi);
    let traces=[];
    for (let i = 0; i < mexerboi.length; i++) {
        if(i== mexerboi.indexOf(max,i)){
            traces[i]=1;
        }else {traces[i]=0;}
    }
    saveCellScore1(ind1,ind2,max,traces);

    return max
}
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
 * @param {int} ind1 index of profile1
 * @param {int} ind2 index of profile2
 * @param {int} score score of cell (ind1,ind2)
 * @param {array{int}} trace tracepointers of cell (ind1,ind2)
 */
function saveCellScore1(ind1,ind2,score,trace){
    table[ind1][ind2][0]=score;
    {table[ind1][ind2][1]=trace;}
}
let bestTrace;
let traceIndex;
/**
 * 
 * @returns a new profile made using the alignment of 2 profile
 */
function buildProfileByTraceBack(){
    bestTrace=[]
    nuProfile=[];
    traceIndex=0;
    profTraceBack(profile1.length-1,profile2.length-1);
    return nuProfile.reverse();
}
let nuProfile;
const addedRowWithGap=[0,0,0,0,1]
/**
 * this creates a profile using only one of the best alignments 
 * (I hypothesize that there won't be multiple best, this is a approximative, I know )
 * @param {int} ind1 index of profile1
 * @param {int} ind2 index of profil2
 * @returns void
 */
function profTraceBack(ind1, ind2){
  //  bestTrace[traceIndex]=cell;
    
    if(ind1==ind2 && ind1==0){
        createProfileRowFrom2(profile1[ind1],profile2[ind2]);
        return
    }
    
    
    if (table[ind1][ind2][1][0]==1){
        createProfileRowFrom2(profile1[ind1],profile2[ind2])
        traceIndex++;
        profTraceBack(ind1-1,ind2-1);
        return;
    }
    if (table[ind1][ind2][1][1]==1){
        createProfileRowFrom2(profile1[ind1],addedRowWithGap)
        traceIndex++;
        profTraceBack(ind1-1,ind2);
        return;
    }
    if(table[ind1][ind2][1][2]==1){
        createProfileRowFrom2(addedRowWithGap,profile2[ind2])
        traceIndex++;
        profTraceBack(ind1,ind2-1);
    }
}
/**
 * 
 * @param {array} row  of profile1
 * @param {array} column  of profie2
 */
function createProfileRowFrom2(row, column){
    nuProfile[traceIndex]=[];
   // let rowCreated;
    const wordOf1=wordOfProileI[key1];
    const wordOf2=wordOfProileI[key2];
    for (let i = 0; i < rr.length; i++) {
        nuProfile[traceIndex][i]=(row[i]*wordOf1+column[i]*wordOf2)/(wordOf1+wordOf2);
    }
}
