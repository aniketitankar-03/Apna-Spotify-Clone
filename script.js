let currentSong = new Audio();
const play = document.querySelector(".play");
const next = document.querySelector(".next");
const previous = document.querySelector(".prevs");
let songs;
let currFolder;

// Declare to store invalid id
let intervalId; 

function secondsToMinuteSeconds(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

function getRandomColor() {
    // Generating random values for R, G, and B components
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    // Constructing the RGB color string
    return `rgb(${r},${g},${b})`;
}


async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
    let response = await a.text();
    let div  = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];
    
    for(let index = 0; index < as.length ; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //play first song
    playMusic(songs[0] , true);

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""; // ul ko blank krne ke liye

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
            <img class="invert" src="./assets/music.svg" alt="" >
            <div class="info">
                <div class="songName" title="${song.replaceAll("%20"," ")}">${song.replaceAll("%20"," ")}</div>
                <div class="songArtist">Song Artist</div>
            </div>
            <div class="playNow">
                <span>Play Now</span>
                <img class="invert" src="./assets/hambgrPlayBtn.svg">
            </div>
        </li>`;

    }

    // attach an element listner to each song
    Array.from( document.querySelector(".songList").getElementsByTagName("li")).forEach( e => {

        e.addEventListener("click" , ()=> {
            // let songName = e.querySelector(".info").firstElementChild.innerHTML;
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
            
        })
    });

    return songs;
}

const playMusic = (track , pause = false)=>{

    clearInterval(intervalId);
    document.querySelector('.container').style.border = "none";

    currentSong.src = `/${currFolder}/${track}`;
    if(!pause){
        currentSong.play();
        play.src = "./assets/pause.svg";
        play.title = "Pause";

        bgColor();

        intervalId = setInterval( ()=>{
            const container = document.querySelector('.container');
            const randomColor = getRandomColor();
            container.style.borderLeft = `5px solid ${randomColor}`;
            container.style.borderRight = `5px solid ${randomColor}`;
        }, 400);
    }
        
    
    document.querySelector(".songinfo").textContent = decodeURI(track);
}

function bgColor(){
    // list me color background add krne ke liye
    Array.from( document.querySelector(".songList").getElementsByTagName("li")).forEach( e => {

        if(currentSong.src.split("/")[5].replaceAll("%20"," ").play = "true"){

            if(e.querySelector(".info").firstElementChild.innerHTML == currentSong.src.split("/")[5].replaceAll("%20"," ")){
                e.classList.add("bgColor");
                e.style.border = "1.1px solid aqua";
            }else{
                e.classList.remove("bgColor");
                e.style.border = "0.1px solid rgba(255, 255, 255, 0.756)";
            }
            
            
        }
    });
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div  = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");

    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];


        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0];

            // Get the metedata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            
            cardContainer.innerHTML =  cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                <img src="/songs/${folder}/cover.jpg" alt="" loading="lazy">
                <h2 class="title"> ${response.title} </h2>
                <p>
                    ${response.description}
                </p>
                <div class="playbtn">
                    <img src="./assets/playbtn.svg" alt="Play Song" title="Play Song">
                </div>
            </div>`;
        }
    }
                                                                      
    // Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach( e=>{
        e.addEventListener("click" , async item =>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })
    })
}

async function main(){
    //Get the list of all the songs                              

    await getSongs("songs/Annnu");

    // Display all albums on the page
    displayAlbums();

    // color the background of current song
    bgColor();
    
    // Attach an event listner to play, previews and next
    play.addEventListener("click", ()=>{

        if(currentSong.paused){
            currentSong.play();
            play.src = "./assets/pause.svg";
            play.title = "Pause";

            intervalId = setInterval( ()=>{
                const container = document.querySelector('.container');
                const randomColor = getRandomColor();
                container.style.borderLeft = `5px solid ${randomColor}`;
                container.style.borderRight = `5px solid ${randomColor}`;
            }, 400);
           
        }
        else{
            currentSong.pause();
            play.src = "./assets/play.svg";
            play.title = "Play";

            clearInterval(intervalId);
            document.querySelector('.container').style.border = "none";
        }
    });

    // Listen for time update event
    currentSong.addEventListener("timeupdate" , ()=>{

        document.querySelector(".timeCurrent").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)}`;
        document.querySelector(".timeDuration").innerHTML = `${secondsToMinuteSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        if((currentSong.currentTime > 0) && (currentSong.currentTime === currentSong.duration)){
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
            
            if((index + 1) < songs.length){
                setTimeout(()=>{
                    playMusic(songs[index + 1]);
                },3000)
            }
        }
    })

    // Add event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click" , e =>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    //Event listner for  hamburger
    document.querySelector(".hambgr").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0";
    })

    // Event listner for closeBtn
    document.querySelector(".closebtn").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-120%";
    })
    document.querySelector(".spotifyPlaylists").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    // Event Listner to preveiws 
    previous.addEventListener("click" , ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if((index - 1) > 0){
            playMusic(songs[index - 1]);
        }else{
            playMusic(songs[songs.length - 1]);
        }
    })

    // Event Listner to next
    next.addEventListener("click" , ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        
        if((index + 1) < songs.length){
            playMusic(songs[index + 1]);
        }else{
            playMusic(songs[0]);
        }
    })

    // Event Listner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
        currentSong.volume = parseInt(e.target.value) / 100;

        if( (e.target.value) === "0"){
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "./assets/mute.svg";
        }else{
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "./assets/volume.svg";
        }

    }) 
      
    // Add Event listner to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{

        if(e.target.src.includes("volume.svg")){

            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            currentSong.volume = 0;
        }
        else {

            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            document.querySelector(".range").getElementsByTagName("input")[0].value = 40;
            currentSong.volume = 0.4;
        }
    })

    

    // Event listner to folder upload button
    document.querySelector(".addFolder").addEventListener("click" , () => {
        document.querySelector(".verifyPage").classList.add("fullPage");

        document.querySelector(".boxContain").innerHTML = `<h1 class="pageHead">Add Your Own PlayList</h1>
                    <div class="content">
                        <label for="folderInput" class="folderLabel">Select PlayList:</label>
                        <input type="file" id="folderInput" name="folder" webkitdirectory directory multiple>

                        <label for="folderName" class="folderLabel">Select PlayList:</label>
                        <input type="text" id="folderName" >

                        
                        <div style="display: flex; justify-content: space-around; gap: 2rem;">
                            <button class="submit" id="folderUploadButton" type="submit">Submit</button>
                            <button class="clear" type="Clear" onclick="clearForm()">Clear</button>
                        </div>
                    </div>
                    <div class="note">
                        <h3>*Note :-</h3>
                        <ul>
                            <li>Folder must contain a cover image.</li>
                            <li>Always name the image as " cover ".</li>
                        </ul>
                    </div>`;

        // Verify page ke colourfull heading ke liye
        intervalId = setInterval( ()=>{
            const randomColor = getRandomColor();
            document.querySelector(".pageHead").style.color = randomColor;
        }, 400);


        document.querySelector("#folderUploadButton").addEventListener("click" ,async (e)=>{
            e.preventDefault();
            let a = await fetch(`http://127.0.0.1:5500/songs/`);
            let response = await a.text();
            console.log(response)
        })
        
        
        // close page
        document.querySelector(".closePage").addEventListener("click" , ()=>{
            document.querySelector(".verifyPage").classList.remove("fullPage");   
            clearInterval(intervalId);
            document.querySelector(".boxContain").innerHTML = " ";
        })
    })

    // Event listner for login button
    document.querySelector(".login").addEventListener("click" , ()=>{
        document.querySelector(".verifyPage").classList.add("fullPage");

        document.querySelector(".boxContain").innerHTML = `<h1 class="pageHead">Login For Better Exerience!!</h1>
                                <div class="content"  >
                                    <label for="loginNumber">Mobile no.:</label>
                                    <input type="text" id="loginNumber">

                                    <label for="loginPassword">Password:</label>
                                    <input type="password" id="loginPassword">

                                    <div style="display: flex; justify-content: space-around;">
                                        <button class="pageBtn loginSubmit" onclick="Login()">Login</button>
                                    </div>

                                    <div class="divisionLine"> </div>

                                    <div>Don't have an account? 
                                        <a href="#">Signup For Spotify.</a></div>
                                </div>`;

        // Verify page ke colourfull heading ke liye
        intervalId = setInterval( ()=>{
            const randomColor = getRandomColor();
            document.querySelector(".pageHead").style.color = randomColor;
        }, 400);                        

        // close page
        document.querySelector(".closePage").addEventListener("click" , ()=>{
            document.querySelector(".verifyPage").classList.remove("fullPage");   
            clearInterval(intervalId);
            document.querySelector(".boxContain").innerHTML = " ";
        })
    })


    // Event listner for signup button
    document.querySelector(".signup").addEventListener("click" , ()=>{
        document.querySelector(".verifyPage").classList.add("fullPage");

        document.querySelector(".boxContain").innerHTML = `<h1 class="pageHead">Signup To Start Listning!!</h1>
                                    <div class="content" >
                                        <label for="signupUsername">Enter Username:</label>
                                        <input type="text" id="signupUsername">
                                
                                        <label for="signupPhone">Enter Phone Number:</label>
                                        <input type="text" id="signupPhone">
                                
                                        <label for="signupPassword">Enter Password:</label>
                                        <input type="password" id="signupPassword">
                                
                                        <div style="display: flex; justify-content: space-around;">
                                            <button class="pageBtn signupSubmit" onclick="Signup()" >Sign up</button>
                                        </div>
                                
                                        <div class="divisionLine"> </div>
                                
                                        <div>Already have an account? 
                                            <a href="#">Log in Here.</a></div>
                                    </div>`;

        // Verify page ke colourfull heading ke liye
        intervalId = setInterval( ()=>{
            const randomColor = getRandomColor();
            document.querySelector(".pageHead").style.color = randomColor;
        }, 400);

        // close page
        document.querySelector(".closePage").addEventListener("click" , ()=>{
            document.querySelector(".verifyPage").classList.remove("fullPage"); 
            clearInterval(intervalId);  
            
            document.querySelector(".boxContain").innerHTML = " ";
        })

    })

}

// babu();
main();


