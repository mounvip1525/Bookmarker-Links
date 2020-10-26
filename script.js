const modal=document.getElementById('modal');
const displayModal=document.getElementById('display-modal');
const closeModal=document.getElementById('close-modal');
const bookmarkForm=document.getElementById('bookmark-form');
const websiteName=document.getElementById('website-name');
const websiteURL=document.getElementById('website-url');
const bookmarkContainer=document.getElementById('bookmark-container');

let bookmarks=[];


// to display the modal
function showModal(){
    modal.classList.add('show-model');
    websiteName.focus();
}


// Retreving the bookmark data,validating it and then pushing to local storage
function storeBookmark(e){
    e.preventDefault();
    // console.log(e);
    const siteName=websiteName.value;
    let siteURL=websiteURL.value;
    if(!siteURL.includes('https://','http://')){
        siteURL=`http://${siteURL}`;
    }
    // console.log(siteName,siteURL);
    if(!validation(siteName,siteURL)){
        return false;
    }
    const bookmark={
        name:siteName,
        url:siteURL,
        };
    bookmarks.push(bookmark);
    // console.log(bookmarks);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    // console.log(JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteName.focus();
    return true;
}


//delete bookmark
function deleteBookmark(url){
    // console.log('delete url',url);
    bookmarks.forEach((bookmark,i)=>{
        if(bookmark.url===url){
            //to find the index, remove it using splice method by passing the index of the matched url and deleting only 1 element hence (index,number of items to be deleted)=(i,1)
            bookmarks.splice(i,1);
        }
        //update the local storage after the deletion 
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
        fetchBookmarks();
    });
}


//Building the bookmark DOM
function buildBookmarks(){
    //this function is used for appeneding only hence the all items get rendered every time the function is used,to prevent we clear the textcontent as below
    bookmarkContainer.textContent='';
    bookmarks.forEach((bookmark)=>{
        const { name, url}=bookmark;
        // console.log( name, url );
        const bookmarkItem=document.createElement('div');
        bookmarkItem.classList.add('bookmark-item');

        const closeIcon=document.createElement('i');
        closeIcon.classList.add('fas','fa-times','delete');
        closeIcon.setAttribute('title','Delete');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        const linkInfo=document.createElement('div');
        linkInfo.classList.add('name')

        const favicon=document.createElement('img');
        favicon.classList.add('favicon');
        favicon.setAttribute('src',`https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute('alt','Favicon');

        const link=document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target','_blank');
        link.textContent=name;

        //Append to the bookmark-container
        linkInfo.append(favicon,link);
        bookmarkItem.append(closeIcon,linkInfo);
        bookmarkContainer.appendChild(bookmarkItem);
    
    });
}



//fetch the local storage data of bookmarks if exists 
function fetchBookmarks(){
    if(localStorage.getItem('bookmarks')){
        bookmarks=JSON.parse(localStorage.getItem('bookmarks'));
    }
    else{
        //if nothing present ten default one in local storage is google site's url
        bookmarks=[
            {
                name:'Google',
                url:'https://www.google.com',
            },
        ];
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    // console.log(bookmarks);
    buildBookmarks();
}



function validation(siteName,siteURL){
    if(!siteName || !siteURL){
        alert('Enter the values and then click save');
        return false;
    }
    // The regex for checking if the url contains "https://"
    const expression= /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex=new RegExp(expression);
    // if(siteURL.match(regex)){
    //     alert('matches')
    // }
    if(!siteURL.match(regex)){
        alert('OOPS! Not a valid url');
        return false;
    }
    return true;
}




//Event Listeners
displayModal.addEventListener('click',showModal);
closeModal.addEventListener('click',()=> modal.classList.remove('show-model'));
window.addEventListener('click',(e)=>e.target===modal ? modal.classList.remove('show-model'): false);

bookmarkForm.addEventListener('submit',storeBookmark);

//On load
fetchBookmarks();