window.onload = charged;
window.onchange = changed;

function charged(){
    /*
    * Lorsque la page est chargée, lance les fonctions de setup d'EventListeners
    */
    setCloseTag();
}

function changed(){
    /*
    * Lorsque la page est changée, lance les fonctions de setup d'EventListeners
    */
    setTimeout(() => {
        setCloseTag();
    },100);
}

function setCloseTag(){
    /*
    * Ajout d'évènements lorsque l'utilisateur met son curseur sur un mot-clé
    */
    let closeTags = document.getElementsByClassName("closeTag");
    for(let closeTag of closeTags){
        closeTag.addEventListener("mouseover",function(e){
            closeTag.parentElement.style = "background-color: var(--ALTENRed); color: white;";
        });
        closeTag.addEventListener("mouseout",function(e){
            closeTag.parentElement.style = "background-color: var(--ALTENGray); color : var(--ALTENDarkBlue);";
        });
    }
}