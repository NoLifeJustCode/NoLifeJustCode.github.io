

let localStorageAccess=checkLocalStorage();//check permission for storage access
let cookieAcess=checkCookieEnable();//check if cookies is enabled
let favourites=[];//storing ids of favourites

let empty={
    'results-for':'',
     results:[]
}//empty data to reset search results
/**
 * check localstorage Acess
 */
function checkLocalStorage(){
    try{
        window.localStorage;
        
    }catch(e){
        return false;
    }
    return true;
}
/**
 * check if cookies enabled
 */
function checkCookieEnable(){
    return navigator.cookieEnabled;
}
/**
 * create search items and populate the lists ui
 * @param {data} search results
 */
function populateSearch(data){
    let result=document.getElementById('searchList');
    let search=document.getElementById('search')
    
  
    if(search.value!=data['results-for']){
        return;
    }
    let len=Math.min(10,data.results.length);
    while(result.children.length){
        result.children[0].remove();
    }
    for(let i =0;i<len;i++)
    {
        result.appendChild(createItem(data.results[i]));
    }
}
/**
 * helper functions to set and retrieve cookies
 * @param {} name 
 * @param {*} value 
 */
function setCookie(name,value){
    document.cookie=`${name}=${value};expires=${new Date(9999,0,1)};path=/`;
    return document.cookie;
}
function getCookie(name){
    let cookie=document.cookie.split(';');
    let index=cookie.find((item)=>item.search(name)!=-1);
    if(!index)
    return "";
    cookie=cookie[index].trimStart();
    return cookie;
}

/**
 * create a single search item in a list i.e ui of search result
 * @param {} data 
 */
function createItem(data){
   
    let item=document.createElement('div');
    let left=document.createElement('div');
    let right=document.createElement('div');
    let name=document.createElement('div');
    let fullname=document.createElement('div');
    let publisher=document.createElement('div');
    let img=document.createElement('img');
    
    item.appendChild(left);
    item.appendChild(right);
    left.appendChild(img);
    right.appendChild(name);
    right.appendChild(fullname);
    right.appendChild(publisher);
    
    img.src=data.image.url;
    img.alt=data.name;
    item.classList.add('item');
    left.classList.add('left');
    right.classList.add('right');
    name.classList.add('name');
    fullname.classList.add('full-name');
    publisher.classList.add('publisher');
    name.appendChild(document.createTextNode(`Name : ${data.name}`))
    fullname.appendChild(document.createTextNode(`Full Name : ${data.biography['full-name']}`));
    publisher.appendChild(document.createTextNode(`Publisher : ${data.biography['publisher']}`))
 
    item.onclick=(e)=>{
        window.location.href= "../views/hero.html?" +data.id;
    }
    if(isFavourite(data.id)!=-1){//handle if result is already in favs
        let span=document.createElement('span')
        span.id=data.id;
        span.classList.add('favourited');
        span.textContent="Favourite"
        right.appendChild(span);
    }else{//if not in favourites provide a button to add to favourite
        let fav=document.createElement('button');
        fav.textContent="favourite"
        let listener=(e)=>{
            e.stopPropagation();
            addToFavourite(data.id);
            e.target.removeEventListener('click',listener);
            e.target.remove();
            let span=document.createElement('span')
            span.classList.add('favourited');
            span.textContent="Favourite"
            right.appendChild(span);
        }
        fav.id=data.id;
        fav.addEventListener('click',listener);
        right.appendChild(fav);
    }
    return item;
}
function setupFavs(e){//initialize favourites tab if result is persisted
    favShow=true;
    for(let i of favourites){
        appendFavs(i);
    }
}


/**
 * helper to check if id is already favourited
 * @param {*} id 
 */
function isFavourite(id){
   return favourites.findIndex((item)=>{
        return item==id;
    })
}
/**
 * remove from favourites and delete respective ui
 * @param {*} id 
 */
function removeFromFavourites(id){
    let index=isFavourite(id);
    let val= index==-1||(favourites.splice(index,1));
    if(index!=-1){
        document.getElementById('favourite').children[index].remove();
    }
    updateFavsToStorage();
    return val;
}
/**
 * update the persited data 
 */
function updateFavsToStorage(){
    if(localStorageAccess)
        localStorage.setItem("favs",favourites);
    else if(cookieAcess)
        setCookie("favs",favourites);
}
/**
 * Add serach id to favourites and create ui
 * @param {*} id 
 */
function addToFavourite(id){
    
    if(isFavourite(id)!=-1)
        return;
    favourites.push(id);
    appendFavs(id);
    updateFavsToStorage();
}
/**
 * helper function to hide or show 
 * @param {*} e 
 */
function toggle(e){
    let target=e.target;
    if(target.classList.contains('hide')){
        target.classList.remove('hide');
    }else{
        target.classList.add('hide');
    }
}

/**
 * append a movies list to favourites list and avoid re rendering complete list
 * @param {*} id 
 */
function appendFavs(id){
    let fav=document.getElementById('favourite');
    let url="https://www.superheroapi.com/api.php/2737909863199750/";
    fetch(url+id).then(response=>response.json()).then(data=>{
   ;
        let item=createItem(data);
        
        let span=item.getElementsByTagName('span')[0]
        span.textContent="";
        span.classList.remove('favourited')
        let btn=document.createElement('button')
        btn.textContent="remove";
        span.appendChild(btn);
        btn.addEventListener('click',(e)=>{
            e.stopPropagation()
            removeFromFavourites(data.id)
           item.remove();
           focusSearchList(e)
        })
        fav.appendChild(item)
    })
}
/**
 * retreive favourties list from storage or cookies
 */
function initFavs(){
    let temp="";
    if(localStorageAccess)
        temp=localStorage.favs;
    else if(cookieAcess)
        temp=getCookie("favs");
    if(temp&&temp!="")
        favourites=temp.split(",");
    favourites=favourites||[];
}
/**
 * handle clicks outside search results to hide the results views
 * @param {*} e 
 */
function focusSearchList(e){
    let container=document.getElementById('searchBox');
    let isFocus=container==e.target;
 
    if(!isFocus){
        for(let i of container.children)
            isFocus|=(i==e.target);
    }
 
    if(!isFocus)
        {
            document.getElementById('searchList').classList.add('hide');
        }
}
/**
 * query search result
 * @param {} val 
 */
async function querySearch(val){
    let url="https://www.superheroapi.com/api.php/2737909863199750/search/"
    let options={
        method:'get',
        headers:{
            accept:'application/json'
        }
    }
    let json=await fetch(url+val,options).then(response=>response.json())
    return json;
}
/**
 * search handler on keyup to similuate auto complete
 * @param {} e 
 */
async function searchHandler(e){
    
    let val=e.target.value;
    let json=val==''?empty:await querySearch(val);
    populateSearch(json);
}
/**
 * initalize the search input and favourites list
 */
function init(){
    let search=document.getElementById('search')
    search.addEventListener('keyup',searchHandler)
    search.addEventListener('click',(e)=>{
   
        document.getElementById('searchList').classList.remove('hide')
        searchHandler(e);
    })
    document.addEventListener('click',focusSearchList)
    initFavs();
    setupFavs();
    document.getElementById('favourite-heros').addEventListener('click',(e)=>{

        toggle({target:document.getElementById('favourite')})
    });
}

window.onload=init;//initalize on windows load