
let nWords;
function printInputZone(){
    nWords=0;
    const num=Number(document.getElementById("nOfWords").value);
    const zone=document.getElementById("inputZone");
    zone.innerHTML="";
    if(num>nWords){
        for (let i = (nWords); i < num; i++) {
            zone.innerHTML+="<div><input class='inputWords' id='inputW"+i+"' type='text'>W"+i+"</div>";
        }
    }else{
        for(let i=nWords;i>num;i--){
            zone.lastChild.remove();
        }
    }
    nWords=num;
    treeGenerator(nWords);
}


let nodeArray;
let maxDepth;
let rowsOfTreeHtml;

function treeGenerator(wordNumber){
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
function msa(){
    const root=nodeArray[nodeArray.length-1];
    words=[];
    for (let i = 0; i < nWords; i++) {
        words[i]=document.getElementById("inputW"+i);
    }
    profiles=[];
    for (let i = 0; i < nodeArray.length; i++) {
        profiles[i]=[]
        
    }
    recProf(root.key,-1);
}
function fakeProfile(word){
    let profile =[];
    for (let i = 0; i < word.length; i++) {
        profile[i]=[];
        profile[i].length=5;
        for (let j = 0; j < rr.length; j++) {
            probabilityOfLetter(profile[i],rr[j],1);
        }
    }
    return profile;
}
function recProf(key1){
    if(nodeArray[key1].depth==0 ){
       return fakeProfile(words[key1]);
    }
    profiles[profiles.length]=mergeProfile(recProf(nodeArray[key1].child1), recProf(nodeArray[key1].child2) );
    return profiles[profiles.length-1];
}
function mergeProfile(profile1, profile2){
    table=[];
    for (let i = 0; i < profile1.length; i++) {
        table[i]=[];
        for (let j = 0; j < profile2.length; j++) { 
           table[i][j]=[];
        }
    }
    recScoreStPr( profile1.length-1 , profile2.length-1)
}

function probabilityOfLetter(letterProb,char1,kWordUsed){
    letterProb[rr.indexOf(char1)]+=((letterProb[rr.indexOf(char1)]*(kWordUsed-1))+1)/kWordUsed;
}

function sim1(char1,char2){//cost of change, -1 for mismatch 
    if(char1!=char2){return 1}
    return 0;
}
function Punteggio(char, profIndex){//make for double 
    let sum=0;
    for (let i = 0; i < rr.length; i++) {
        sum+=sim1(char, rr[i])*prof[profIndex][i];
    }
}


let wordK;
let prof;
let table;

function recScoreStPr(ind1,ind2){//make generic using fake profiles for words
    if(ind1==0&&ind2==0){
        return table[ind1][ind2][0];
    }

    let matchScore=-Punteggio(wordK[ind1],ind2)+recScoreStPr(ind1-1,ind2-1,isLocal);
    const del1Score=(-1)+recScoreStPr(ind1-1,ind2, isLocal);
    const del2Score=-Punteggio("_",ind2)+recScoreStPr(ind1,ind2-1, isLocal);

    const mexerboi=[matchScore,del1Score,del2Score];
 

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

function saveCellScore1(ind1,ind2,score,trace){
    table[ind1][ind2][0]=score;
    {table[ind1][ind2][1]=trace;}
}
//todo backtrace only one result for profiles


