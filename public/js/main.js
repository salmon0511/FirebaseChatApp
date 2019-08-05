'use strict'
  // Initialize Firebase
const config = {
    apiKey: "AIzaSyCNoa2jjczGj9gtPh5uHcDc8ANk7XgXrsk",
    authDomain: "my-project-e5755.firebaseapp.com",
    databaseURL: "https://my-project-e5755.firebaseio.com",
    projectId: "my-project-e5755",
    storageBucket: "my-project-e5755.appspot.com",
    messagingSenderId: "598542474987"
};
firebase.initializeApp(config);


const db = firebase.firestore();
const collection = db.collection('messages');

var message = document.getElementById('message-text');
const name = document.getElementById('message-name')
const form = document.querySelector('form');
const ul = document.querySelector('ul');
const messages = document.getElementById('tan_list');
const auth = firebase.auth;
let me = null;

 /**
* Handles the sign in button press.
*/
function signIn() {
firebase
  .auth()
  .signInAnonymously()
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode === "auth/operation-not-allowed") {
      alert("You must enable Anonymous auth in the Firebase Console.");
    } else {
      console.error(error);
    }
  });
}



function dataStore(){
    form.addEventListener('submit', e=>{
    e.preventDefault();
    
    const val = message.value.trim();
    if (val ===''){
        alert('脱糞民以外はここにいちゃいけん！帰りなさい！！');
        return;
    }

    
    if(name.value === ''){
        name.value = '脱糞民';
    }
    
    
    collection.add({
        message:message.value,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        name:name.value,
        uid:me ? me.uid: 'nobady'
        
    })
    .then(doc =>{
        console.log(`${doc.id} added!`);
    })
    .catch(error => {
        alert('君の懺悔は神様に届かなかったようだ。もう一度懺悔してくれ！');
        console.log('document add error!')
        console.log(error);
    });
    
});
}



function functionApp() {
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    me = user;
    
    while(messages.firestChild){
        messages.removeChild(messages.firstChild);
    }
    // User is signed in.
    
    collection.orderBy('created').limit(100).onSnapshot(snapshot =>{
    snapshot.docChanges().forEach(change =>{
        if(change.type === 'added'){
            
            // generate element and add class
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.className = 'tan_name';
            const div = document.createElement('div');
            div.className = 'tan_message';
            //const p = document.createElement('p');
            
            
            const d  =change.doc.data();
            //ここで<li>タグ内の挙動を書く
            span.textContent = d.name;
            //messageがきちんと改行されるようにするには配列にする
            var _text = new Array();
            _text = d.message.split(/\r?\n/g);
            
            
            var buffer = "";
            var line = ""
            
            for(var i = 0; i < _text.length ; i++ ){
                if(_text[i].length > 0) {
                    line +=  "<p>"
                    line += _text[i];
                    line += "</p>"
                
                }else if(_text[i].length == 0){
                    line+= "<br>";
                }
                buffer += line;
                line = "";
                div.innerHTML = buffer;
            }
            
            
            
            //li要素の中に追加して表示する エラーが起きてる
            //div.appendChild(p);
            //li.insertBefore(div, li.children[0]);
            
            
            
            li.appendChild(span).appendChild(div);
            ul.insertBefore(li, ul.children[0]);
//            ul.appendChild(li);
            
            }
        message.value = '';
        });
    });
      console.log(`Logged in as:${user.uid}`);
      return;
  } else {
      console.log('Nobbady is logged in');
  }
});
}

    

window.onload = function() {
    signIn();
    dataStore();
    functionApp();   
};