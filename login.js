//   For storing the userdata to local storage 


function Login(){

    let mobile = document.getElementById("loginNumber").value;     //.value is use to get the value which is written in id naam
    let passward = document.getElementById("loginPassword").value;     //.value is use to get the value which is written in id naam

    let count = 0;

    if(mobile.length == 0)
    {
        alert("Enter mobile number");
    }
    else if(mobile.length !== 10)
    {
        alert("Mobile number should be of 10 digits");
    }
    {
        for(let i=0; i< getUsersdata.length ; i++)
        {
            if(mobile == getUsersdata[i].mobile)
            {
                if(passward == getUsersdata[i].passward)
                {
                    alert("Login Successfull !!");
                    document.querySelector(".buttons").innerHTML = `<div class="accountIcon"> ${getUsersdata[i].username.split('')[0]} <div class="accountUsername">${getUsersdata[i].username}</div> </div>`;
                    document.querySelector(".verifyPage").classList.remove("fullPage"); 
                    document.querySelector(".boxContain").innerHTML = " ";
                }
                else{
                    alert("Invalid Passward !!");
                    mobile = "";
                }
            }
            else{
                count++;
            }
        }
    }

    if(count == getUsersdata.length)
    {
        alert("User is Not registered, Sign up to Continue");
        document.querySelector(".verifyPage").classList.remove("fullPage");
        
    }

}
