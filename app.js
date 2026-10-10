// 紫荆玲珑 Zijing Linglong
// 本地音乐播放器核心


const upload =
document.getElementById("musicUpload");


const audio =
document.getElementById("audioPlayer");


const songName =
document.getElementById("songName");


const musicList =
document.getElementById("musicList");


const prev =
document.getElementById("prev");


const next =
document.getElementById("next");



let songs = [];

let currentIndex = 0;



// =====================
// IndexedDB
// =====================


let db;


const request =
indexedDB.open(
"ZijingLinglong",
1
);



request.onupgradeneeded = function(e){

    db =
    e.target.result;


    db.createObjectStore(
        "music",
        {
            keyPath:"id",
            autoIncrement:true
        }
    );

};



request.onsuccess=function(e){

    db =
    e.target.result;


    loadMusic();

};




// =====================
// 上传音乐
// =====================


upload.addEventListener(
"change",
function(){

    const files =
    this.files;


    for(let file of files){


        let song={

            name:file.name,

            data:file,

            time:
            Date.now()

        };


        saveMusic(song);

    }


});




// =====================
// 保存
// =====================


function saveMusic(song){


    let tx =
    db.transaction(
        "music",
        "readwrite"
    );


    let store =
    tx.objectStore("music");


    store.add(song);



    tx.oncomplete=function(){

        loadMusic();

    };


}




// =====================
// 读取音乐库
// =====================


function loadMusic(){


    let tx =
    db.transaction(
        "music",
        "readonly"
    );


    let store =
    tx.objectStore("music");



    let request =
    store.getAll();



    request.onsuccess=function(){

        songs =
        request.result;


        renderList();

    };

}




// =====================
// 显示列表
// =====================


function renderList(){


    musicList.innerHTML="";


    songs.forEach(
    (song,index)=>{


        let li =
        document.createElement("li");


        li.innerHTML =
        "🎵 "
        +
        song.name;



        li.onclick=function(){

            playSong(index);

        };


        musicList.appendChild(li);


    });


}




// =====================
// 播放歌曲
// =====================


function playSong(index){


    if(!songs[index])
    return;


    currentIndex=index;


    let song =
    songs[index];


    let url =
    URL.createObjectURL(
        song.data
    );


    audio.src=url;


    songName.innerText =
    song.name;


    audio.play();


}




// =====================
// 上一首
// =====================


prev.onclick=function(){


    currentIndex--;


    if(currentIndex<0)

    currentIndex =
    songs.length-1;


    playSong(currentIndex);


};




// =====================
// 下一首
// =====================


next.onclick=function(){


    currentIndex++;


    if(currentIndex>=songs.length)

    currentIndex=0;


    playSong(currentIndex);


};



// 自动下一首

audio.onended=function(){

    next.click();

};
