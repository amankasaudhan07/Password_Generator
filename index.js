const inputSlider =document.querySelector("[data-length-slider]");
const lengthDisplay =document.querySelector("[data-lengthNumber]");
const passwordDisplay =document.querySelector("[data-passwordDisplay]");
const copyBtn =document.querySelector("[data-copy]");
const copymsg =document.querySelector("[data-copyMsg]");
const uppercaseCheck =document.querySelector("#uppercase");
const lowercaseCheck =document.querySelector("#lowercase");
const numberCheck =document.querySelector("#number");
const symbolCheck =document.querySelector("#symbols");
const indicator =document.querySelector("[data-indicator]");
const generateBtn =document.querySelector(".generatebutton");
const allcheckBox =document.querySelectorAll("input[type=checkbox]");

const symbol = '`~!@#$%^&*()_+=[{]}|\";:.,><?/'

let password="";  
let passwordlength=10;
let checkCount=0;
handleSlider();

setIndicator("#ccc");

// set password length on UI
function handleSlider(){
    inputSlider.value=passwordlength;
    lengthDisplay.innerText=passwordlength;
    console.log("handle slider");

    const min=inputSlider.min;
    const max=inputSlider.max;

    // const percentWidth=(passwordlength-min)*100/(max-min);

    var backgroundSizePercentage = ((passwordlength - min) * 100) / (max - min);

// Set the background size of the element
document.querySelector(`[data-length-slider]`).style.backgroundSize = backgroundSizePercentage + "% 100%";
     
}

function setIndicator(color)
{
    indicator.style.backgroundColor =color;
    // shadow
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}

function getrandomInt(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
    return getrandomInt(0,9);
}

function generateLowerCase(){
        return String.fromCharCode(getrandomInt(97,123));
}

function generateUpperCase(){
        return String.fromCharCode(getrandomInt(65,91));
}

function generateSymbol()
{
     const randnum=getrandomInt(0,symbol.length);
     return symbol.charAt(randnum);
}

function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasLower&&hasUpper&&(hasNum||hasSym)&&passwordlength>=8)
      setIndicator("#0f0");
    else if((hasLower||hasUpper)&&(hasNum||hasSym)&&passwordlength>=6)
     setIndicator("#ff0");
    else
     setIndicator("#f00");

}

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText="copied";
    }
    catch(e)
    {
        copymsg.innerText="Failed";
    }

    // to make copy wala span visible
    copymsg.classList.add("active");

    setTimeout(()=>{
        copymsg.classList.remove("active");
    },2000);
}

function sufflepassword(suffle)
{
    //Fisher yates Method
    for(let i=suffle.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp=suffle[i];
        suffle[i]=suffle[j];
        suffle[j]=temp;
    }
    let str="";
    suffle.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allcheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
          checkCount++;
    });

    //special cndn
    if(passwordlength<checkCount)
    {
        passwordlength=checkCount;
        handleSlider();
    }
}

allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});


inputSlider.addEventListener('input',(e)=>{
    passwordlength=e.target.value;
    handleSlider();
}); 

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
      copyContent();
}); 

generateBtn.addEventListener('click',()=>{
    console.log("inside gnrt btn")
    // none of the checkbox is checked
    if(checkCount==0) return;

    if(passwordlength < checkCount){ 
        passwordlength = checkCount;
        handleSlider();
    }

    // lets start the journey to find new password;
        console.log("start");
    //    remove old password
    password="";
//   while(password.length<passwordlenght){
//     if(uppercaseCheck.checked)
//      {
//         password+=generateUpperCase();
//      }
//     if(lowercaseCheck.checked)
//      {
//         password+=generateLowerCase();
//      }
//     if(numberCheck.checked)
//      {
//         password+=generateRandomNumber();
//      }
//     if(symbolCheckCheck.checked)
//      {
//         password+=generateSymbol();
//      }

//     }
    

let funcarr=[];
if(uppercaseCheck.checked)
funcarr.push(generateUpperCase);

if(lowercaseCheck.checked)
funcarr.push(generateLowerCase)  ;

if(numberCheck.checked)
funcarr.push(generateRandomNumber) ;

if(symbolCheck.checked)
funcarr.push(generateSymbol);


// compulsory addition
for(let i=0;i<funcarr.length;i++){
    password+=funcarr[i]();
}
console.log("cumpulsory done");
  // remaining
  for(let i=0;i<passwordlength-funcarr.length;i++)
  {
      let randInd=getrandomInt(0,funcarr.length);
      password+=funcarr[randInd]();
    }
    
    console.log("remaining done");
    // suffle the password
    password= sufflepassword(Array.from(password));
    
    console.log("shuffling done");
    // show in UI
    passwordDisplay.value=password;
    console.log("UI addition done");
    // call calculate strength
    calcStrength();
});

  