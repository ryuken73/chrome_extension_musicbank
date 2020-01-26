console.log(document)
const fixedDiv = document.createElement('div');
fixedDiv.setAttribute('id', 'searchResult');
fixedDiv.setAttribute("style", "position:fixed;top: 0;right: 0;width:200px;height:50%;z-index:10;background-color:yellow;");
document.body.appendChild(fixedDiv)