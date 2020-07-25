/**
 * retrieve hero details from url to faciliate working even if cookies is disabled
 */
async function  loadHeroDetails(){
    let id=window.location.href.split('?')[1];
    let url="https://www.superheroapi.com/api.php/2737909863199750/"
    try{
        let data=await fetch(url+id).then(response=>response.json());
        console.log(data);
        createPage(data);
    }catch(e){
        console.log('error loading data',e)
    }
}
/**
 * create hero attributes 
 * @param {c} name 
 * @param {*} data 
 */
function makeItems(name,data){
    let div=document.createElement('div')
    div.classList.add('hero-info');
    let span=document.createElement('span')
    span.classList.add('key');
    span.textContent=name;
    div.appendChild(span);
    div.appendChild(document.createTextNode(" : "+data))
    return div;
}
/**
 * fill details to the layout of the page
 * @param {*} data 
 */
function createPage(data){
    console.log(data)
    let avatar=document.getElementById('avatar');
    let powerstats=document.getElementById('powerstats');
    let biography=document.getElementById('Biography');
    let aliases=document.getElementById('aliases');
    document.getElementById('name').textContent=data.name;
    avatar.src=data.image.url
    for(let i in data.powerstats){
        powerstats.appendChild(makeItems(i , data.powerstats[i]));
    }
    for(let i in data.biography){
        biography.appendChild(makeItems(i , data.biography[i]))
    }
}
function init(){
    loadHeroDetails();
}

window.onload=init;