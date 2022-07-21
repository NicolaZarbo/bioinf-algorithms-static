function graphCreator(){
    let rows=document.getElementById("rows").value;
    let columns=document.getElementById("columns").value;

    document.getElementById("brate").innerHTML="";
    const zone=document.getElementById("graphZone");
    zone.innerHTML="";
    zone.style="display : grid; grid-template-rows:"+rows+"; grid-template-columns:"+columns+";";
    let k=0;
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= columns; c++) {
            const node = document.createElement("div");
            node.style="grid-row:"+r+";grid-column:"+c+";";
            node.className="node";
        
            node.setAttribute( "onclick","pointerBase("+k+");");
            node.innerText=k;
            zone.appendChild(node);
            graph[k]=[];
            k++;
        }
        
    }
    zone.addEventListener("click",savePosition);
    pos1=0;
    based=-1;
}
let graph=[];
let based;
let baseCordinates=[];
let endCordinates=[];
let pos1;

function savePosition(event){
    if(event.target.className!="node")
    { return;}
    if(pos1==0){
        var rect = document.getElementById("graphZone").getBoundingClientRect();
        baseCordinates[0] = event.clientX - rect.left;
        baseCordinates[1] = event.clientY - rect.top;
        pos1=1;
        return;
    }else{
        var rect = document.getElementById("graphZone").getBoundingClientRect();
        endCordinates[0] = event.clientX - rect.left;
        endCordinates[1] = event.clientY - rect.top;
        drawArrow();
        pos1=0;
    }
}
function pointerBase(key){
    
    if(based!=-1){
        if(!graph[based].includes(key)){
            const basedArray=graph[based];
            let dim=basedArray.length;
            graph[based][dim]=key;
        }
        based=-1;
    }
    else{
        based=key;
    }
}
function printGraphTxt(){
    const txtGraph=document.getElementById("graphtxt");
    let txt="";
    const dimension=graph.length;
    for(let i=0;i<dimension;i++){
        txt+="{";
        for (let j = 0; j < dimension; j++) {
            if(graph[i].includes(j)){
                txt+="1";
            }
            else{
                txt+="0";
            }
            if(j!=dimension-1)
                {txt+=",";}
        }
        if(i!=dimension-1)
        {txt+="},\n";}
        else{txt+="}";}
    }
    txtGraph.innerText=txt;

}

function drawArrow(){
    let vec=[(baseCordinates[0]-endCordinates[0]),(baseCordinates[1]-endCordinates[1])];
    let width=Math.sqrt(vec[0]*vec[0]+vec[1]*vec[1]);
    const angle=findAngle(vec);
    const arrowMove=-width;
    let basePositionx=baseCordinates[0]-(width/2)-vec[0]/2;
    if(vec[0]>0)
        {basePositionx=endCordinates[0]-(width/2)+vec[0]/2;}
     let arr='<div class="arrowContainer" style="left:'+(basePositionx) +'px; top:'+(baseCordinates[1]-vec[1]/2)+'px; transform:rotateZ('+(angle)+'rad) ">';
     arr+='<div style="width:'+width+'px" class="stick"></div><div style="right:'+arrowMove+'px;" class="arrow"></div>   </div>';
     document.getElementById("brate").innerHTML=arr+document.getElementById("brate").innerHTML;
     baseCordinates[0]=0;
     baseCordinates[1]=0;
     based=-1;
     writeInfo();
     
}
function findAngle(vector){
    let modulesqr= Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]);
    let angle;

    if(vector[1]>0){
         angle=3.14159+ Math.acos(vector[0]/modulesqr);
    }
    else{
        angle= Math.acos(-vector[0]/modulesqr);
    }
    return angle;
}
function writeInfo(){
    const info=document.getElementById("graphInfo");
    info.textContent="";
    if(graphHasPath()){
        info.textContent=" EULERIAN PATH      ";
    }
    if(graphHasCircle()){
        info.textContent="EULERIAN CIRCLE ";
    }
}
function graphHasPath(){
    let oddOnes=0;
    for (let i = 0; i < graph.length; i++) {
        const nOfEdges=numberOfIncomingEdges(i)+numberOfOutgoingEdges(i);
        if(nOfEdges%2==1){
            oddOnes++;
        }
    }
    return oddOnes<=2;
}
function graphHasCircle(){
    for (let i = 0; i < graph.length; i++) {
        if(numberOfIncomingEdges(i)!=numberOfOutgoingEdges(i)){
            return false;
        }
    }
    return true;
}
function numberOfIncomingEdges(nodeKey){
    let sum=0;
    for (let i = 0; i < graph.length; i++) {
        if(graph[i].includes(nodeKey)){
            sum++;
        }
    }
    return sum;
}
function numberOfOutgoingEdges(nodeKey){
    
    return graph[nodeKey].length;
}
function printPath(){
    findEulerianPath();
    const zone=document.getElementById("pathZone");
    zone.innerText="";
    for (let i = ePath.length-1; i >=0 ; i--) {
        let bro=document.createElement("div");
        bro.innerText=ePath[i];
        bro.className="node";
        bro.style="pointer-events: none; "
        zone.appendChild(bro);
        if(i>0){zone.innerHTML+='<div class="arrowContainer" style="position:relative"><div  class="stick"></div><div style="right: -65px;" class="arrow"></div>   </div>';}
        
    }
}

let tempPath=[];
let ePath=[];
let visitedEdges=[];

function findEulerianPath(){
    ePath.length=0;
    visitedEdges.length=0;
    tempPath.length=0;
    for (let i = 0; i < graph.length; i++) {
        visitedEdges[i]=[];
    }
    let nodeDim=[];
    for (let i = 0; i < graph.length; i++) {
        const node = graph[i]
        nodeDim[i] =numberOfOutgoingEdges(i);
    }
    //const nodeDim=graph.map( node=> {numberOfIncomingEdges(node)+numberOfOutgoingEdges(node);});
    const max= maxOfArray(nodeDim);
    tempPath[0]=nodeDim.indexOf(max);
    popper(tempPath[0]);

}
function maxOfArray(arrayInt){
    max=-1;
    for (let i = 0; i < arrayInt.length; i++) {
        if(arrayInt[i]>max){
            max=arrayInt[i];
        }
    }
    return max;
}
function popper(top){
    if(tempPath.length<=0){
        return;
    }
    const freeEdges=availableEdges(top);
    if(freeEdges.length>0){
        const rng=Math.floor(Math.random()*freeEdges.length);
        addToVisited(top,freeEdges[rng]);
        tempPath[tempPath.length]=freeEdges[rng];
        popper(tempPath[tempPath.length-1]);
    }else{
        ePath[ePath.length]=tempPath[tempPath.length-1];
        tempPath.length=tempPath.length-1;
        if(tempPath.length<=0){
            return;
        }
        popper(tempPath[tempPath.length-1]);
    }
}
function addToVisited(node, edge){
    visitedEdges[node][visitedEdges[node].length]=edge;
}
function availableEdges(node){
    const edges=outgoingEdges(node);
    let freeEdges=[];
    let i=0;
    edges.forEach(edge => {
        if(!visitedEdges[node].includes(edge)){
            freeEdges[i]=edge;
            i++;
        }
    });
    return freeEdges;
}
function outgoingEdges(node){
    return graph[node];
}